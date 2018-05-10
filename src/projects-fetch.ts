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
    projects: { [name: string]: IProject };
}

export interface IProject {
    projectType: ProjectType;
    sourceRoot: string;
}

export enum ProjectType {
    APP = 'application',
    LIB = 'library'
}
