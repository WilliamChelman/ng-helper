import detectIndent from 'detect-indent';
import fs from 'fs';
import path from 'path';

import { Logger } from '../common/logger';
import { getProjects, IPackageJson, IProject } from '../common/projects-fetch';

export class Version {
    static async version({ projectRoot, version = this.getRootVersion(projectRoot) }: IVersionOptions) {
        const { projects } = getProjects(projectRoot);

        // only keep relevant projects
        Object.keys(projects)
            .map(name => projects[name])
            .filter(project => fs.existsSync(path.join(projectRoot, project.root, 'package.json')))
            .forEach(project => this.updateVersion(project, version, projectRoot));
    }

    private static getRootVersion(projectRoot: string): string {
        const packagePath = path.join(projectRoot, 'package.json');
        const packageJson: IPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return packageJson.version;
    }

    private static updateVersion(project: IProject, version: string, projectRoot: string) {
        const packagePath = path.join(projectRoot, project.root, 'package.json');
        Logger.info(`Setting version '${version}' to '${packagePath}'`);
        const file = fs.readFileSync(packagePath, 'utf8');
        const packageJson: IPackageJson = JSON.parse(file);
        packageJson.version = version;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, detectIndent(file).indent || 4), 'utf8');
    }

    private constructor() {}
}

export interface IVersionOptions {
    projectRoot: string;
    version?: string;
}
