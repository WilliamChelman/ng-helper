import path from 'path';
import { Observable, of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { exec } from '../exec';
import { getProjects, IDictionary, IProject, ProjectType } from '../projects-fetch';

export async function serve(selectedProjectNames: string[], options: IServeOptions) {
    const { projects, defaultProject } = await getProjects(options.projectRoot);

    if (options.interactive) {
        selectedProjectNames = []; // TODO ask user
    } else if (!selectedProjectNames || selectedProjectNames.length === 0) {
        selectedProjectNames = [defaultProject];
    }
    // only keep relevant projects
    Object.keys(projects)
        .filter(name => selectedProjectNames.indexOf(name) === -1)
        .forEach(name => delete projects[name]);

    // We only start the apps after each library built at least once, and each library wait for the previous library to have built before starting
    const libraries$ = Object.keys(projects)
        .filter(name => projects[name].projectType === ProjectType.LIB)
        .reduce((previous$, name) => {
            const project = projects[name];
            const subject = new Subject();
            previous$.pipe(take(1)).subscribe(() => {
                serveLib(name, project, options)
                    .pipe(take(1))
                    .subscribe(() => subject.next());
            });
            return subject;
        }, of({})); // need to put something in the "of" otherwise it will not fire

    libraries$.pipe(take(1)).subscribe(() => serveApps(projects, options));
}

function serveApps(projects: IDictionary<IProject>, options: IServeOptions) {
    Object.keys(projects)
        .filter(name => projects[name].projectType === ProjectType.APP)
        .forEach(name => serveApp(name, projects[name], options));
}

function serveApp(name: string, app: IProject, options: IServeOptions): Observable<void> {
    const subject = new Subject<void>();

    // Could not parse stdout out ng serve for some reason, so nothing interesting here for now
    exec('ng', ['serve', name], { cwd: options.projectRoot, stdio: ['pipe', process.stdout, process.stderr] }).subscribe(message => {
        console.log('NEXT', message);
    }, console.error);

    return subject;
}

function serveLib(name: string, library: IProject, options: IServeOptions): Observable<void> {
    const subject = new Subject<void>();
    const src = path.join(options.projectRoot, library.sourceRoot);
    const args = [`--watch ${src}`, '--ext ts,html,css,scss', `--exec 'ng build ${name}'`];
    exec('nodemon', args, {
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
