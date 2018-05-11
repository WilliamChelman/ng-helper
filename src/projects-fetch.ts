import fs from 'fs';
import path from 'path';

export async function getProjects(rootPath: string): Promise<IProjects> {
    const filePath = path.join(rootPath, 'angular.json');
    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exists`);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
