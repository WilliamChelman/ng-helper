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
        expect(getExecLine(0)).to.eq('ng serve test-app');
    });

    it('should serve apps with options', async () => {
        await Serve.serve({ projectRoot, projectNames: ['app-a', 'app-b'], appOptions: '--aot --prod' });
        expect(spawnStub.callCount).to.eq(2);
        expect(getExecLine(0)).to.eq('ng serve app-a --aot --prod');
        expect(getExecLine(1)).to.eq('ng serve app-b --aot --prod');
    });

    it('should serve one library', async () => {
        await Serve.serve({ projectRoot, projectNames: ['lib-a'], appOptions: '' });
        expect(spawnStub.callCount).to.eq(1);
        expect(getExecLine(0)).to.eq(
            "nodemon --watch test/test-app/projects/lib-a/src --ext ts,html,css,scss --exec 'ng build lib-a'"
        );
    });

    function getExecLine(index: number): string {
        const args = spawnStub.args[index];
        return `${args[0]} ${args[1].join(' ')}`;
    }
});
