import program from 'commander';

import { serve } from './serve';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../../package.json');

program
    .version(packageJson.version)
    .command('serve [projects...]')
    .option('-i, --interactive', 'launch in interactive mode')
    .option('--projectRoot [path]', 'path to the root of the repository, defaults to searching current directory', process.cwd())
    // node bin/ng-helper serve -i a ba cz
    .action(serve);
program.parse(process.argv);

// function collect(val: string, memo: string[]): string[] {
//     memo.push(val);
//     return memo;
// }
