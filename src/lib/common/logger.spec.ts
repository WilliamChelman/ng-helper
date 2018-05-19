import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';

import { Logger, LogLevel } from './logger';

describe('logger', () => {
    // afterEach needed because the restore inside the test doesn't work
    afterEach(() => (sinon as any).restore());
    it('should debug', () => testLogger('debug', 1));
    it('should log', () => testLogger('log', 2));
    it('should info', () => testLogger('info', 3));
    it('should warn', () => testLogger('warn', 4));
    it('should error', () => testLogger('error', 5));
});

function testLogger(method: keyof (typeof Logger), calls: number) {
    const logSpy = sinon.stub(console, method as any);
    for (const logLevel of getLogLevelValues()) {
        sinon.stub(Logger, 'logLevel').value(logLevel);
        (Logger as any)[method](method);
    }
    expect(logSpy.callCount).to.eq(calls, `console.${method} should have been called ${calls} time(s)`);
    logSpy.restore();
}

function getLogLevelValues(): number[] {
    return Object.keys(LogLevel).map(key => (LogLevel as any)[key]);
}
