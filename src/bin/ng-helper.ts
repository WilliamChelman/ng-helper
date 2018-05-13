import program from 'commander';
import path from 'path';

import { serve } from './serve';

// tslint:disable-next-line:no-var-requires
const { version } = require('../../package.json');

export function ngHelper(argv: string[] = process.argv) {
    program
        .version(version)
        .command('serve [projects...]')
        .option('-i, --interactive', 'launch in interactive mode')
        .option('-a, --all', 'start everything')
        .option('--all-libs', 'start all libraries')
        .option(
            '--app-options <options>',
            'set options for app serving, like "--aot --prod"' +
                ' (if more than one option, you have to put everything between quotes)'
        )
        .option(
            '--projectRoot <path>',
            'path to the root of the repository',
            (relPath: string, cwd: string) => (relPath.startsWith('.') ? path.join(cwd, relPath) : relPath),
            process.cwd()
        )
        .action((projectNames: string[], options: any) => {
            serve({ ...options, projectNames });
        });
    program.parse(argv);
}
