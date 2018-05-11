import path from 'path';
import { Observable, Subject } from 'rxjs';

import { execO } from '../exec';
import { getProjects, IProject, ProjectType } from '../projects-fetch';

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
                return serveApp(name, project, options);
            case ProjectType.LIB:
                return serveLib(name, project, options);
            default:
                throw new Error(`Unknown project type '${project.projectType}'`);
        }
    });
}

function serveApp(name: string, app: IProject, options: IServeOptions): Observable<void> {
    const subject = new Subject<void>();

    execO('ng', ['serve', name], { cwd: options.projectRoot }).subscribe(message => {
        console.log('NEXT', message);
    }, console.error);

    return subject;
}

function serveLib(name: string, library: IProject, options: IServeOptions): Observable<void> {
    const subject = new Subject<void>();
    const src = path.join(options.projectRoot, library.sourceRoot);
    const args = [`--watch ${src}`, '--ext ts,html,css,scss', `--exec 'ng build ${name}'`];
    execO('nodemon', args, {
        cwd: options.projectRoot,
        shell: true
    }).subscribe(message => {
        console.log(message);
        if (message.includes('[nodemon] clean exit')) {
            subject.next();
        }
    }, console.error);

    return subject;
}

export interface IServeOptions {
    interactive: boolean;
    projectRoot: string;
}
