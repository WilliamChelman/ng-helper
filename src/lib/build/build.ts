import path from 'path';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BinUtils } from '../common/bin-utils';
import { ChildProcessService } from '../common/child-process.service';
import { Logger } from '../common/logger';
import { ICommonOptions, Options } from '../common/options';
import { getProjects, IDictionary, IProject, ProjectType } from '../common/projects-fetch';

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
                await this.buildProject(name, projects[name], options, 'appOptions').toPromise();
            }
        }
    }

    private static async buildLibs(projects: IDictionary<IProject>, options: IBuildOptions): Promise<void> {
        for (const name of Object.keys(projects)) {
            const project = projects[name];
            if (project.projectType === ProjectType.LIB) {
                await this.buildProject(name, projects[name], options, 'libOptions').toPromise();
            }
        }
    }

    private static buildProject(
        name: string,
        project: IProject,
        options: IBuildOptions,
        buildOptionKey: keyof IBuildOptions
    ): Observable<void> {
        Logger.info(`Building project: ${name}`);

        const subject = new Subject<void>();
        const src = path.join(options.projectRoot, project.sourceRoot);

        const command = BinUtils.getBinPathStrict('ng', '@angular/cli');
        const args = ['build', name];

        if (buildOptionKey && options[buildOptionKey]) {
            const opt = options[buildOptionKey];
            if (typeof opt === 'string') {
                args.push(opt);
            } else {
                const message = `Property '${buildOptionKey}' of options is not a string`;
                Logger.error(message, options);
                throw new Error(message);
            }
        }

        ChildProcessService.spawnObs({
            command,
            args,
            spawnOptions: {
                cwd: options.projectRoot,
                stdio: 'inherit'
            }
        })
            .pipe(finalize(() => subject.complete()))
            .subscribe(
                message => {
                    Logger.log('NEXT', message);
                },
                err => {
                    Logger.error(`Error while testing library ${name}:`, err);
                    process.exit(err);
                }
            );

        return subject;
    }

    private constructor() {}
}

// tslint:disable-next-line:no-empty-interface for future proofing
export interface IBuildOptions extends ICommonOptions {}
