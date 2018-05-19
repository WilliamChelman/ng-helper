import { spawn, SpawnOptions } from 'child_process';
import { Observable, Observer } from 'rxjs';

import { Logger } from './logger';

export class ChildProcessService {
    static spawnObs({ command, args = [], spawnOptions = {} }: ISpawnObsOptions): Observable<string> {
        return Observable.create((obs: Observer<string>) => {
            Logger.info(`Executing: ${command} ${args.join(' ')}`);

            const child = spawn(command, args, spawnOptions);
            const killer = () => child.kill();

            process.on('SIGINT', killer);

            if (child.stdout) {
                child.stdout.on('data', data => obs.next(data.toString()));
            }

            if (child.stderr) {
                child.stderr.on('data', data => obs.error(data.toString()));
            }

            child.on('exit', (code, signal) => {
                process.removeListener('SIGINT', killer);
                if (!child.killed) {
                    if (code !== 0) {
                        obs.error(code);
                    }
                    obs.complete();
                }
            });
        });
    }
}

export interface ISpawnObsOptions {
    command: string;
    args?: string[];
    spawnOptions?: SpawnOptions;
    stderrHandling?: StdHandlingType;
}

export enum StdHandlingType {
    NEXT,
    ERROR
}
