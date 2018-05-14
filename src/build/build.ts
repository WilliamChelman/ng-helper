import path from 'path';
import { Observable, Subject } from 'rxjs';

import { BinUtils } from '../common/bin-utils';
import { Logger } from '../common/logger';
import { ICommonOptions, Options } from '../common/options';
import { getProjects, IDictionary, IProject, ProjectType } from '../common/projects-fetch';
import { spawn } from '../common/spawn';

export class Build {
    static async build(options: IBuildOptions) {
        options = await Options.processOptions(options);
        const { projects } = getProjects(options.projectRoot);

        // only keep relevant projects
        Object.keys(projects)
            .filter(name => options.projectNames.indexOf(name) === -1)
            .forEach(name => delete projects[name]);

        await this.buildLibs(projects, options);
        await this.buildApps(projects, options);
    }

    private static async buildApps(projects: IDictionary<IProject>, options: IBuildOptions): Promise<void> {
        for (const name of Object.keys(projects)) {
            const project = projects[name];
            if (project.projectType === ProjectType.APP) {
                await this.buildApp(name, projects[name], options).toPromise();
            }
        }
    }

    private static async buildLibs(projects: IDictionary<IProject>, options: IBuildOptions): Promise<void> {
        for (const name of Object.keys(projects)) {
            const project = projects[name];
            if (project.projectType === ProjectType.LIB) {
                await this.buildLib(name, projects[name], options).toPromise();
            }
        }
    }

    private static buildApp(name: string, app: IProject, options: IBuildOptions): Observable<void> {
        Logger.info(`Building application: ${name}`);

        const subject = new Subject<void>();
        const appOptions = options.appOptions ? options.appOptions.split(' ') : [];
        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }

        // Could not parse stdout out ng serve for some reason, so nothing interesting here for now
        spawn(ng, ['build', name, ...appOptions], {
            cwd: options.projectRoot,
            stdio: ['pipe', process.stdout, process.stderr]
        }).subscribe(
            message => {
                Logger.log('NEXT', message);
            },
            err => Logger.error(`Error while building application ${name}:`, err),
            () => subject.complete()
        );

        return subject;
    }

    private static buildLib(name: string, library: IProject, options: IBuildOptions): Observable<void> {
        Logger.info(`Building library: ${name}`);

        const subject = new Subject<void>();
        const src = path.join(options.projectRoot, library.sourceRoot);

        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }

        spawn(ng, ['build', name], {
            cwd: options.projectRoot,
            stdio: ['pipe', process.stdout, process.stderr]
        }).subscribe(
            message => {
                Logger.log('NEXT', message);
            },
            err => Logger.error(`Error while building library ${name}:`, err),
            () => subject.complete()
        );

        return subject;
    }

    private constructor() {}
}

// tslint:disable-next-line:no-empty-interface for future proofing
export interface IBuildOptions extends ICommonOptions {}
