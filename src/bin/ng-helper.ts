import program, { Command } from 'commander';
import path from 'path';

import { Build } from '../build/build';
import { LogLevel } from '../common/logger';
import { ICommonOptions } from '../common/options';
import { Serve } from '../serve/serve';

// tslint:disable-next-line:no-var-requires
const { version } = require('../../package.json');

export class NgHelper {
    static init() {
        program.version(version);
        this.commonOptions(
            program.command('serve [projects...]').action((projectNames: string[], options: any) => {
                Serve.serve(this.toCommonOptions(projectNames, options));
            })
        );

        this.commonOptions(
            program.command('build [projects...]').action((projectNames: string[], options: any) => {
                console.log(Object.keys(LogLevel));
                Build.build(this.toCommonOptions(projectNames, options));
            })
        );
    }

    static launch(argv: string[] = process.argv) {
        program.parse(argv);
    }

    private static toCommonOptions(projectNames: string[], options: any): ICommonOptions {
        return {
            interactive: options.interactive,
            projectRoot: options.projectRoot,
            all: options.all,
            allLibs: options.allLibs,
            projectNames,
            appOptions: options.appOptions,
            logLevel: LogLevel[options.logLevel] as any
        };
    }

    private static commonOptions(command: Command): Command {
        return command
            .option('-A, --all', 'select all projects')
            .option('-a, --all-libs', 'select all libraries')
            .option(
                '--app-options <options>',
                'set options for app tasks, like "--aot --prod"' +
                    ' (if more than one option, you have to put everything between quotes)'
            )
            .option('-i, --interactive', 'launch in interactive mode')
            .option(
                '--log-level <level>',
                `set the log level, possible values are ${Object.keys(LogLevel).filter(level =>
                    isNaN(parseInt(level, 10))
                )}`,
                LogLevel[LogLevel.INFO]
            )
            .option(
                '--project-root <path>',
                'path to the root of the repository',
                (relPath: string, cwd: string) => (relPath.startsWith('.') ? path.join(cwd, relPath) : relPath),
                process.cwd()
            );
    }

    private constructor() {}
}
