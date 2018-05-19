import { expect } from 'chai';
import { describe, it } from 'mocha';

import { askProjectRoot, askProjects } from './interactive';
import { IProjects, ProjectType } from './projects-fetch';

// tslint:disable-next-line:no-var-requires
const prompts = require('prompts');

describe('interactive', () => {
    it('should prompt for project root', async () => {
        prompts.inject({ projectRoot: './foo/bar' });
        const response = await askProjectRoot();
        expect(response).to.eq('./foo/bar');
    });

    it('should prompt for project names', async () => {
        const projectNames = ['jean-app', 'jacques-lib'];
        prompts.inject({ projectNames });
        const projects: IProjects = {
            defaultProject: 'jean-app',
            projects: {
                'jean-app': {
                    projectType: ProjectType.APP,
                    sourceRoot: './here',
                    root: './'
                },
                'jacques-lib': {
                    projectType: ProjectType.LIB,
                    sourceRoot: './there',
                    root: './'
                }
            }
        };
        const response = await askProjects(projects);
        expect(response).to.eq(projectNames);
    });
});
