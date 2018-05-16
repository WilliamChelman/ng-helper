import path from 'path';
import { Observable, Subject } from 'rxjs';

import { BinUtils } from '../common/bin-utils';
import { Logger } from '../common/logger';
import { ICommonOptions, Options } from '../common/options';
import { getProjects, IDictionary, IProject, ProjectType } from '../common/projects-fetch';
import { spawn } from '../common/spawn';

export class Test {
    static async test(options: ITestOptions) {
        options = await Options.processOptions(options);
        const { projects } = getProjects(options.projectRoot);

        // only keep relevant projects
        Object.keys(projects)
            .filter(name => options.projectNames.indexOf(name) === -1)
            .forEach(name => delete projects[name]);

        await this.testLibs(projects, options);
        await this.testApps(projects, options);
    }

    private static async testApps(projects: IDictionary<IProject>, options: ITestOptions): Promise<void> {
        for (const name of Object.keys(projects)) {
            const project = projects[name];
            if (project.projectType === ProjectType.APP) {
                await this.testApp(name, projects[name], options).toPromise();
            }
        }
    }

    private static async testLibs(projects: IDictionary<IProject>, options: ITestOptions): Promise<void> {
        for (const name of Object.keys(projects)) {
            const project = projects[name];
            if (project.projectType === ProjectType.LIB) {
                await this.testLib(name, projects[name], options).toPromise();
            }
        }
    }

    private static testApp(name: string, app: IProject, options: ITestOptions): Observable<void> {
        Logger.info(`Testing application: ${name}`);

        const subject = new Subject<void>();
        const appOptions = options.appOptions ? options.appOptions.split(' ') : [];
        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }

        // Could not parse stdout out ng serve for some reason, so nothing interesting here for now
        spawn(ng, ['test', name, ...appOptions], {
            cwd: options.projectRoot,
            stdio: ['pipe', process.stdout, process.stderr]
        }).subscribe(
            message => {
                Logger.log('NEXT', message);
            },
            err => Logger.error(`Error while testing application ${name}:`, err),
            () => subject.complete()
        );

        return subject;
    }

    private static testLib(name: string, library: IProject, options: ITestOptions): Observable<void> {
        Logger.info(`Testing library: ${name}`);

        const subject = new Subject<void>();
        const src = path.join(options.projectRoot, library.sourceRoot);

        const ng = BinUtils.getBinPath('ng', '@angular/cli');
        if (!ng) {
            throw new Error('Could not find path to ng bin');
        }
        const args = ['test', name];
        if (options.libOptions) {
            args.push(options.libOptions);
        }
        spawn(ng, args, {
            cwd: options.projectRoot,
            stdio: ['pipe', process.stdout, process.stderr]
        }).subscribe(
            message => {
                Logger.log('NEXT', message);
            },
            err => Logger.error(`Error while testing library ${name}:`, err),
            () => subject.complete()
        );

        return subject;
    }

    private constructor() {}
}

// tslint:disable-next-line:no-empty-interface for future proofing
export interface ITestOptions extends ICommonOptions {}
