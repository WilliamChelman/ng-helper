import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

export class BinUtils {
    static getBinPath(bin: string, packageName = bin): string | undefined {
        return (
            this.getNormalBin(bin, false) ||
            this.getNormalBin(bin, true) ||
            this.getPackageBin(bin, packageName, false) ||
            this.getPackageBin(bin, packageName, true)
        );
    }

    static getNormalBin(bin: string, global: boolean): string | undefined {
        const args = global ? ['bin', '-g'] : ['bin'];
        const binFolder = child_process.execFileSync('npm', args, { encoding: 'utf8' }).trim();
        const localBin = path.join(binFolder, bin);
        if (fs.existsSync(localBin)) {
            return localBin;
        }

        return;
    }

    static getPackageBin(bin: string, packageName: string, global: boolean): string | undefined {
        const nodeModules = child_process
            .execFileSync('npm', ['root'], { encoding: 'utf8', cwd: global ? __dirname : void 0 })
            .trim();
        const packageJson = path.join(nodeModules, packageName, 'package.json');
        if (fs.existsSync(packageJson)) {
            const binRelPath = JSON.parse(fs.readFileSync(packageJson, 'utf8')).bin[bin];
            return path.join(nodeModules, packageName, binRelPath);
        }
        return;
    }

    private constructor() {}
}
