import program, { Command, CommanderStatic } from 'commander';
import path from 'path';

import { Build } from '../build/build';
import { LogLevel } from '../common/logger';
import { ICommonOptions } from '../common/options';
import { Serve } from '../serve/serve';
import { Test } from '../test/test';

// tslint:disable-next-line:no-var-requires
const { version } = require('../../../package.json');

export class CLI {
    static get(): CommanderStatic {
        program.version(version);
        this.commonOptions(
            program.command('serve [projects...]').action((projectNames: string[], options: any) => {
                Serve.serve(this.toCommonOptions(projectNames, options));
            })
        );

        this.commonOptions(
            program.command('build [projects...]').action((projectNames: string[], options: any) => {
                Build.build(this.toCommonOptions(projectNames, options));
            })
        );

        this.commonOptions(
            program.command('test [projects...]').action((projectNames: string[], options: any) => {
                Test.test(this.toCommonOptions(projectNames, options));
            })
        );

        return program;
    }

    private static toCommonOptions(projectNames: string[], options: any): ICommonOptions {
        return {
            interactive: options.interactive,
            projectRoot: options.projectRoot,
            all: options.all,
            allLibs: options.allLibs,
            projectNames,
            appOptions: options.appOptions,
            libOptions: options.libOptions,
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
            .option(
                '--lib-options <options>',
                'set options for lib tasks, like "--prod"' +
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
                '-p, --project-root <path>',
                'path to the root of the repository',
                (relPath: string, cwd: string) => (relPath.startsWith('.') ? path.join(cwd, relPath) : relPath),
                process.cwd()
            );
    }

    private constructor() {}
}
