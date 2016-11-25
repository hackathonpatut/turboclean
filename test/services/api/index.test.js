'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('api service', function() {
  it('registered the apis service', () => {
    assert.ok(app.service('apis'));
  });
});
