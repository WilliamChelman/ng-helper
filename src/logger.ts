import chalk from 'chalk';

// tslint:disable:no-console
export class Logger {
    static log = (...args: any[]) => console.log(...args);
    static error = (...args: any[]) => console.log(chalk.red(...args));
    static warn = (...args: any[]) => console.log(chalk.yellow(...args));
    static info = (...args: any[]) => console.log(chalk.magenta(...args));
    static infoHeader = (...args: any[]) => console.log(chalk.magenta.underline(...args));
    static infoSubHeader = (...args: any[]) => console.log(chalk.magenta(...args));

    private constructor() {}
}
