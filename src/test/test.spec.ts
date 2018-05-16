import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import sinon, { SinonStub } from 'sinon';

import { BinUtils } from '../common/bin-utils';
import * as spawn from '../common/spawn';
import { Test } from './test';

describe('Test', () => {
    const projectRoot = './test/test-app/';
    let spawnStub: SinonStub;
    let binPathSub: SinonStub;

    before(() => {
        spawnStub = sinon.stub(spawn, 'spawn').callsFake(() => of('[nodemon] clean exit'));
        binPathSub = sinon.stub(BinUtils, 'getBinPath').callsFake(name => name);
    });

    after(() => {
        spawnStub.restore();
        binPathSub.restore();
    });

    afterEach(() => spawnStub.resetHistory());

    it('should test default app', async () => {
        await Test.test({ projectRoot, projectNames: [], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        expect(getExecLine(0)).to.eq('ng test test-app');
    });

    it('should test apps with options', async () => {
        await Test.test({ projectRoot, projectNames: ['app-a', 'app-b'], appOptions: '--aot --prod' });
        expect(spawnStub.callCount).to.eq(2);
        expect(getExecLine(0)).to.eq('ng test app-a --aot --prod');
        expect(getExecLine(1)).to.eq('ng test app-b --aot --prod');
    });

    it('should test one library', async () => {
        await Test.test({ projectRoot, projectNames: ['lib-a'], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        const expectedCommand = 'ng test lib-a';
        expect(getExecLine(0)).to.eq(expectedCommand);
    });

    function getExecLine(index: number): string {
        const args = spawnStub.args[index];
        return `${args[0]} ${args[1].join(' ')}`;
    }
});
