import { IProjects } from './projects-fetch';

// tslint:disable-next-line:no-var-requires
const prompts = require('prompts');

enum PromptType {
    TEXT = 'text',
    MULTI_SELECT = 'multiselect'
}

export async function askProjectRoot(initial: string = ''): Promise<string> {
    const fieldName = 'projectRoot';
    return prompts({
        type: PromptType.TEXT,
        initial,
        name: fieldName,
        message: 'set project path'
    }).then((responses: any) => responses[fieldName]);
}

export async function askProjects({ projects, defaultProject }: IProjects): Promise<string[]> {
    const fieldName = 'projectNames';
    const choices = Object.keys(projects).map(name => ({
        title: `${name} (${projects[name].projectType})`,
        value: name,
        selected: name === defaultProject
    }));
    return prompts({
        type: PromptType.MULTI_SELECT,
        name: fieldName,
        message: 'Choose projects to serve',
        choices,
        hint: '- Space to select. Return to submit'
    }).then((responses: any) => responses[fieldName]);
}
