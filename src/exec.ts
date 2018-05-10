import { spawn, SpawnOptions } from 'child_process';

export function exec(command: string, args?: string[], options?: SpawnOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, args, options);

        let killed = false;

        const killer = () => {
            childProcess.kill();
            killed = true;
        };

        process.on('SIGINT', killer);

        childProcess.on('exit', code => {
            process.removeListener('SIGINT', killer);
            if (!killed) {
                code === 0 ? resolve() : reject(code);
            }
        });
    });
}
