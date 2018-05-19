import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import sinon, { SinonStub } from 'sinon';

import { BinUtils } from '../common/bin-utils';
import { ChildProcessService, ISpawnObsOptions } from '../common/child-process.service';
import { Build } from './build';

describe('Build', () => {
    const projectRoot = './test/test-app/';
    let spawnStub: SinonStub;
    let binPathSub: SinonStub;

    before(() => {
        spawnStub = sinon.stub(ChildProcessService, 'spawnObs').callsFake(() => of('[nodemon] clean exit'));
        binPathSub = sinon.stub(BinUtils, 'getBinPath').callsFake(name => name);
    });

    after(() => {
        spawnStub.restore();
        binPathSub.restore();
    });

    afterEach(() => spawnStub.resetHistory());

    it('should build default app', async () => {
        await Build.build({ projectRoot, projectNames: [], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        expect(getExecLine(0)).to.eq('ng build test-app');
    });

    it('should build apps with options', async () => {
        await Build.build({ projectRoot, projectNames: ['app-a', 'app-b'], appOptions: '--aot --prod' });
        expect(spawnStub.callCount).to.eq(2);
        expect(getExecLine(0)).to.eq('ng build app-a --aot --prod');
        expect(getExecLine(1)).to.eq('ng build app-b --aot --prod');
    });

    it('should build one library', async () => {
        await Build.build({ projectRoot, projectNames: ['lib-a'], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        const expectedCommand = 'ng build lib-a';
        expect(getExecLine(0)).to.eq(expectedCommand);
    });

    function getExecLine(index: number): string {
        const options: ISpawnObsOptions = spawnStub.args[index][0];
        return `${options.command} ${options.args!.join(' ')}`;
    }
});
