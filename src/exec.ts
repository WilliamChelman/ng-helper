import { spawn, SpawnOptions } from 'child_process';
import { Observable, Subject } from 'rxjs';

export function execO(command: string, args?: string[], spawnOptions?: SpawnOptions): Observable<string> {
    const subject = new Subject<string>();

    const child = spawn(command, args, spawnOptions);
    let killed = false;

    const killer = () => {
        child.kill();
        killed = true;
    };

    process.on('SIGINT', killer);

    child.stdout!.on('data', data => subject.next(data.toString()));

    child.stderr!.on('data', data => subject.error(data.toString()));

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
