import path from 'path';

import { askProjectRoot, askProjects } from './interactive';
import { Logger, LogLevel } from './logger';
import { getProjects, IProjects, ProjectType } from './projects-fetch';

export class Options {
    static async processOptions(options: ICommonOptions): Promise<ICommonOptions> {
        if (options.logLevel != null) {
            Logger.logLevel = options.logLevel;
        }
        if (options.interactive) {
            options = await this.interactive(options);
        }

        const container: IProjects = getProjects(options.projectRoot);
        const { projects, defaultProject } = container;

        if (options.all) {
            options.projectNames = Object.keys(projects);
        }

        if (options.allLibs) {
            const libs = Object.keys(projects).filter(
                name => projects[name].projectType === ProjectType.LIB && options.projectNames.indexOf(name) === -1
            );
            options.projectNames.push(...libs);
        }

        if (!options.projectNames || options.projectNames.length === 0) {
            options.projectNames = [defaultProject];
        }

        return options;
    }

    private static async interactive(options: ICommonOptions): Promise<ICommonOptions> {
        let projectRoot = await askProjectRoot(options.projectRoot);
        if (projectRoot.startsWith('.')) {
            projectRoot = path.join(process.cwd(), projectRoot);
        }
        const container = getProjects(projectRoot);
        const projectNames = await askProjects(container);
        return { ...options, projectRoot, projectNames };
    }

    private constructor() {}
}

export interface ICommonOptions {
    interactive?: boolean;
    projectRoot: string;
    all?: boolean;
    allLibs?: boolean;
    projectNames: string[];
    appOptions?: string;
    libOptions?: string;
    logLevel?: LogLevel;
}
