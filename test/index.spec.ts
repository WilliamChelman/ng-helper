import { expect } from 'chai';
import { describe, it } from 'mocha';

import { sayHi } from '../src';

describe('sayHi', () => {
  it('should say hi', () => {
    expect(sayHi()).to.eq('Oh, hi Mark');
  });
});
