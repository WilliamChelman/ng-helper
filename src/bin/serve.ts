import path from 'path';

import { exec } from '../exec';
import { getProjects, ProjectType } from '../projects-fetch';

export async function serve(projectNames: string[], options: IServeOptions) {
    const allProjects = await getProjects(options.projectRoot);

    if (options.interactive) {
        projectNames = []; // ask user
    } else if (!projectNames || projectNames.length === 0) {
        projectNames = [allProjects.defaultProject];
    }

    // const libs = projectNames.map(name => allProjects.projects[name]).filter(project => project.projectType === ProjectType.LIB);
    // const apps = projectNames.map(name => allProjects.projects[name]).filter(project => project.projectType === ProjectType.APP);

    // npx ts-node src/bin/ng-helper.ts serve --projectRoot ./test/test-app/
    projectNames.map(name => {
        const project = allProjects.projects[name];
        switch (project.projectType) {
            case ProjectType.APP:
                return exec('ng', ['serve', name], { cwd: options.projectRoot }).catch(err => console.error(err));
            case ProjectType.LIB:
                const src = path.join(options.projectRoot, project.sourceRoot);
                const args = [`--watch ${src}`, '--ext ts,html,css,scss', `--exec 'ng build ${name}'`];
                return exec('nodemon', args, { cwd: options.projectRoot, shell: true, stdio: ['pipe', process.stdout, process.stderr] });
            default:
                throw new Error(`Unknown project type '${project.projectType}'`);
        }
    });
}

export interface IServeOptions {
    interactive: boolean;
    projectRoot: string;
}
