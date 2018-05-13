import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon, { SinonStub } from 'sinon';

import { ngHelper } from './ng-helper';
import * as serve from './serve';

describe('ng-helper', () => {
    let serveStub: SinonStub;
    before(() => {
        serveStub = sinon.stub(serve, 'serve');
    });
    after(() => serveStub.restore());
    it('should serve', () => {
        ngHelper([process.argv[0], process.argv[1], 'serve', '--projectRoot', './foo/bar']);
        expect(serveStub.callCount).to.eq(1);
    });
});
