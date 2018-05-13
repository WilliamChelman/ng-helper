import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import sinon, { SinonStub } from 'sinon';

import * as spawn from '../common/spawn';
import { Serve } from './serve';

describe('Serve', () => {
    const projectRoot = './test/test-app/';
    let spawnStub: SinonStub;

    before(() => {
        spawnStub = sinon.stub(spawn, 'spawn').callsFake(() => of('[nodemon] clean exit'));
    });

    after(() => spawnStub.restore());

    afterEach(() => spawnStub.resetHistory());

    it('should serve default app', async () => {
        await Serve.serve({ projectRoot, projectNames: [], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        expect(getExecLine(0).endsWith('ng serve test-app')).to.eq(true);
    });

    it('should serve apps with options', async () => {
        await Serve.serve({ projectRoot, projectNames: ['app-a', 'app-b'], appOptions: '--aot --prod' });
        expect(spawnStub.callCount).to.eq(2);
        expect(getExecLine(0).endsWith('ng serve app-a --aot --prod')).to.eq(true);
        expect(getExecLine(1).endsWith('ng serve app-b --aot --prod')).to.eq(true);
    });

    it('should serve one library', async () => {
        await Serve.serve({ projectRoot, projectNames: ['lib-a'], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        const expectedCommand =
            "nodemon --watch test/test-app/projects/lib-a/src --ext ts,html,css,scss --exec 'ng build lib-a'";
        expect(getExecLine(0).endsWith(expectedCommand)).to.eq(true);
    });

    function getExecLine(index: number): string {
        const args = spawnStub.args[index];
        return `${args[0]} ${args[1].join(' ')}`;
    }
});
