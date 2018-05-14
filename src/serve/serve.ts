import path from 'path';
import { Observable, of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { BinUtils } from '../common/bin-utils';
import { Logger } from '../common/logger';
import { ICommonOptions, Options } from '../common/options';
import { getProjects, IDictionary, IProject, ProjectType } from '../common/projects-fetch';
import { spawn } from '../common/spawn';

export class Serve {
    static async serve(options: IServeOptions) {
        options = await Options.processOptions(options);
        const { projects } = getProjects(options.projectRoot);

        // only keep relevant projects
        Object.keys(projects)
            .filter(name => options.projectNames.indexOf(name) === -1)
            .forEach(name => delete projects[name]);

        // We only start the apps after each library built at least once,
        // and each library wait for the previous library to have built before starting
        const libraries$ = Object.keys(projects)
            .filter(name => projects[name].projectType === ProjectType.LIB)
            .reduce((previous$, name) => {
                const project = projects[name];
                const subject = new Subject();

                previous$.pipe(take(1)).subscribe(() => {
                    this.serveLib(name, project, options)
                        .pipe(take(1))
                        .subscribe(() => subject.next());
                });

                return subject;
            }, of({})); // need to put something in the "of" otherwise it will not fire

        libraries$.pipe(take(1)).subscribe(() => this.serveApps(projects, options));
    }

    private static serveApps(projects: IDictionary<IProject>, options: IServeOptions) {
        Object.keys(projects)
            .filter(name => projects[name].projectType === ProjectType.APP)
            .forEach(name => this.serveApp(name, projects[name], options));
    }

    private static serveApp(name: string, app: IProject, options: IServeOptions): Observable<void> {
        Logger.info(`Serving application: ${name}`);

        const subject = new Subject<void>();
        const appOptions = options.appOptions ? options.appOptions.split(' ') : [];
        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }
        // Could not parse stdout out ng serve for some reason, so nothing interesting here for now
        spawn(ng, ['serve', name, ...appOptions], {
            cwd: options.projectRoot,
            stdio: ['pipe', process.stdout, process.stderr]
        }).subscribe(
            message => {
                Logger.log('NEXT', message);
            },
            err => Logger.error(`Error while serving application ${name}:`, err)
        );

        return subject;
    }

    /**
     * @returns An Observable that fires each time the library finish building
     */
    private static serveLib(name: string, library: IProject, options: IServeOptions): Observable<void> {
        Logger.info(`Serving library: ${name}`);

        const subject = new Subject<void>();
        const src = path.join(options.projectRoot, library.sourceRoot);

        const nodemon = BinUtils.getBinPath('nodemon');
        if (!nodemon) {
            throw new Error('Could not find path to nodemon bin');
        }

        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }

        const args = [`--watch ${src}`, '--ext ts,html,css,scss', `--exec '${ng} build ${name}'`];

        spawn(nodemon, args, {
            cwd: options.projectRoot,
            shell: true
        }).subscribe(
            message => {
                Logger.info(message);
                if (message.includes('[nodemon] clean exit')) {
                    // one build just finished
                    subject.next();
                }
            },
            err => Logger.error(`Serving library ${name} exited with code ${err}`)
        );

        return subject;
    }

    private constructor() {}
}

// tslint:disable-next-line:no-empty-interface for future proofing
export interface IServeOptions extends ICommonOptions {}
