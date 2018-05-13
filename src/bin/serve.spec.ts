import { expect } from 'chai';
import { describe, it } from 'mocha';
import { of } from 'rxjs';
import sinon, { SinonStub } from 'sinon';

import * as exec from '../exec';
import { serve } from './serve';

describe('serve', () => {
    const projectRoot = './test/test-app/';
    let execStub: SinonStub;

    before(() => {
        execStub = sinon.stub(exec, 'exec').callsFake(() => of('[nodemon] clean exit'));
    });

    after(() => execStub.restore());

    afterEach(() => execStub.resetHistory());

    it('should serve default app', () => {
        serve({ projectRoot, projectNames: [], appOptions: '' });
        expect(execStub.callCount).to.eq(1);
        expect(getExecLine(0)).to.eq('ng serve test-app');
    });

    it('should serve apps with options', () => {
        serve({ projectRoot, projectNames: ['app-a', 'app-b'], appOptions: '--aot --prod' });
        expect(execStub.callCount).to.eq(2);
        expect(getExecLine(0)).to.eq('ng serve app-a --aot --prod');
        expect(getExecLine(1)).to.eq('ng serve app-b --aot --prod');
    });

    it('should serve one library', () => {
        serve({ projectRoot, projectNames: ['lib-a'], appOptions: '' });
        expect(execStub.callCount).to.eq(1);
        expect(getExecLine(0)).to.eq(
            "nodemon --watch test/test-app/projects/lib-a/src --ext ts,html,css,scss --exec 'ng build lib-a'"
        );
    });

    function getExecLine(index: number): string {
        const args = execStub.args[index];
        return `${args[0]} ${args[1].join(' ')}`;
    }
});
