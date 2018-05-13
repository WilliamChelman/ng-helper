import path from 'path';

export class Nodemon {
    static getBinPath(): string {
        return path.join(__dirname, '../../node_modules/.bin/nodemon');
    }
    private constructor() {}
}
