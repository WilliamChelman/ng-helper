import program from 'commander';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../package.json');

command(process.argv);

export function command(args: string[]): IOptions {
  const parsed = program
    .version(packageJson.version)
    .option('-i, --interactive')
    .parse(args);

  return {
    interactive: parsed.interactive
  };
}

export interface IOptions {
  interactive: boolean;
}
