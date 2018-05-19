import { expect } from 'chai';
import fs from 'fs';
import { describe, it } from 'mocha';
import sinon, { SinonStub } from 'sinon';

import { Version } from './version';

describe('Version', () => {
    const projectRoot = './test/test-app/';
    // let spawnStub: SinonStub;
    let writeFileStub: SinonStub;

    before(() => {
        writeFileStub = sinon.stub(fs, 'writeFileSync');
    });

    after(() => {
        writeFileStub.restore();
    });

    afterEach(() => writeFileStub.resetHistory());

    it('should update package versions to root version', () => {
        Version.version({ projectRoot });
        expect(writeFileStub.callCount, 'There should have been 4 package.json rewrite').to.eq(4);
        writeFileStub.args.map<string>(callArgs => callArgs[1]).forEach(file => {
            expect(file.includes('"version": "0.0.0"'), 'correct version should have been written').to.eq(true);
        });
    });

    it('should update package versions to specified version', () => {
        const version = '1.2.3';
        Version.version({ projectRoot, version });
        expect(writeFileStub.callCount, 'There should have been 4 package.json rewrite').to.eq(4);
        writeFileStub.args.map<string>(callArgs => callArgs[1]).forEach(file => {
            expect(file.includes(`"version": "${version}"`), 'correct version should have been written').to.eq(true);
        });
    });
});
