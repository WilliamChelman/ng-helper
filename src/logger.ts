export enum LogLevel {
    DEBUG,
    LOG,
    INFO,
    WARN,
    ERROR,
    NONE
}

// tslint:disable:no-console
export class Logger {
    static logLevel: LogLevel = LogLevel.INFO;

    static debug(...args: any[]) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.debug(...args);
        }
    }

    static log(...args: any[]) {
        if (this.logLevel <= LogLevel.LOG) {
            console.log(...args);
        }
    }

    static info(...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.info(...args);
        }
    }

    static warn(...args: any[]) {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(...args);
        }
    }

    static error(...args: any[]) {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(...args);
        }
    }

    private constructor() {}
}
