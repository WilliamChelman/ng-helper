import path from 'path';

export class Ng {
    static getBinPath(): string {
        return path.join(__dirname, '../../node_modules/.bin/ng');
    }
    private constructor() {}
}
