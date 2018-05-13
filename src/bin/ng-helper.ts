import program, { Command } from 'commander';
import path from 'path';

import { build } from '../build/build';
import { serve } from '../serve/serve';

// tslint:disable-next-line:no-var-requires
const { version } = require('../../package.json');

export class NgHelper {
    static init() {
        program.version(version);
        this.commonOptions(
            program.command('serve [projects...]').action((projectNames: string[], options: any) => {
                serve({ ...options, projectNames });
            })
        );

        this.commonOptions(
            program.command('build [projects...]').action((projectNames: string[], options: any) => {
                build({ ...options, projectNames });
            })
        );
    }

    static launch(argv: string[] = process.argv) {
        program.parse(argv);
    }

    private static commonOptions(command: Command): Command {
        return command
            .option('-i, --interactive', 'launch in interactive mode')
            .option('-a, --all', 'select all projects')
            .option('--all-libs', 'select all libraries')
            .option(
                '--app-options <options>',
                'set options for app tasks, like "--aot --prod"' +
                    ' (if more than one option, you have to put everything between quotes)'
            )
            .option(
                '--projectRoot <path>',
                'path to the root of the repository',
                (relPath: string, cwd: string) => (relPath.startsWith('.') ? path.join(cwd, relPath) : relPath),
                process.cwd()
            );
    }

    private constructor() {}
}
