import fs from 'fs';
import path from 'path';

const cache: IDictionary<IProjects> = {};

export async function getProjects(rootPath: string): Promise<IProjects> {
    if (cache[rootPath]) {
        return cache[rootPath];
    }
    const filePath = path.join(rootPath, 'angular.json');
    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exists`);
    }
    const container: IProjects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    Object.keys(container.projects)
        .filter(name => name.endsWith('-e2e'))
        .forEach(name => delete container.projects[name]);
    return (cache[rootPath] = container);
}

export interface IProjects {
    defaultProject: string;
    projects: IDictionary<IProject>;
}

export interface IProject {
    projectType: ProjectType;
    sourceRoot: string;
}

export interface IPackageJson {
    name: string;
    dependencies: IDictionary<string>;
    peerDependencies: IDictionary<string>;
    scripts: IDictionary<string>;
}

export interface IDictionary<T> {
    [key: string]: T;
    [key: number]: T;
}

export enum ProjectType {
    APP = 'application',
    LIB = 'library'
}
