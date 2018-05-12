import { expect } from 'chai';
import fs from 'fs';
import { describe, it } from 'mocha';
import { SinonSpy, spy } from 'sinon';

import { getProjects } from './projects-fetch';

describe('projects-fetch', () => {
    const knownPath = './test/test-app/';

    it('should throw error on file not found', () => {
        expect(() => getProjects('./foo/bar')).to.throw();
    });

    it('should not throw error on file found', () => {
        expect(() => getProjects(knownPath)).not.to.throw();
    });

    let fsSpy: SinonSpy;
    before(() => {
        fsSpy = spy(fs, 'readFileSync');
    });
    after(() => {
        fsSpy.restore();
    });
    it('should cache results', () => {
        getProjects(knownPath);
        getProjects(knownPath);
        expect(fsSpy.callCount).to.eq(1, 'file read should have been called once');
    });

    it('should not keep e2e projects', () => {
        const container = getProjects(knownPath);
        ['app-a-e2e', 'app-b-e2e', 'test-app-e2e'].forEach(e2eApp => {
            expect(container.projects[e2eApp]).to.eq(void 0, `${e2eApp} should have been filtered out`);
        });
    });
});
