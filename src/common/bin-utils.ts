import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

export class BinUtils {
    static getBinPath(name: string): string | undefined {
        const localBinFolder = child_process.execFileSync('npm', ['bin'], { encoding: 'utf8' }).trim();
        const localBin = path.join(localBinFolder, name);
        if (fs.existsSync(localBin)) {
            return localBin;
        }

        const globalBinFolder = child_process.execFileSync('npm', ['bin', '-g'], { encoding: 'utf8' }).trim();
        const globalBin = path.join(globalBinFolder, name);
        if (fs.existsSync(globalBin)) {
            return globalBin;
        }

        return '';
    }

    private constructor() {}
}
