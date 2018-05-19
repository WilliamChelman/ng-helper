import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon, { SinonStub } from 'sinon';

import { Serve } from '../serve/serve';
import { CLI } from './cli';

describe('cli', () => {
    let serveStub: SinonStub;
    before(() => {
        serveStub = sinon.stub(Serve, 'serve');
    });
    after(() => serveStub.restore());
    it('should serve', () => {
        CLI.get().parse([process.argv[0], process.argv[1], 'serve', '--project-root', './foo/bar']);
        expect(serveStub.callCount).to.eq(1);
    });
});
