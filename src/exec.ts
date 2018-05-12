import { spawn, SpawnOptions } from 'child_process';
import { Observable, Subject } from 'rxjs';

import { Logger } from './logger';

export function exec(command: string, args: string[] = [], spawnOptions?: SpawnOptions): Observable<string> {
    Logger.info(`Executing: ${command} ${args.join(' ')}`);

    const subject = new Subject<string>();
    const child = spawn(command, args, spawnOptions);
    let killed = false;

    const killer = () => {
        child.kill();
        killed = true;
    };

    process.on('SIGINT', killer);

    if (child.stdout) {
        child.stdout.on('data', data => subject.next(data.toString()));
    }

    if (child.stderr) {
        child!.stderr.on('data', data => subject.error(data.toString()));
    }
    child.on('exit', code => {
        process.removeListener('SIGINT', killer);
        if (!killed) {
            if (code !== 0) {
                subject.error(code);
            }
            subject.complete();
        }
    });

    return subject;
}
