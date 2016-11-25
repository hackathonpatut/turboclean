'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('targets service', function() {
  it('registered the targets service', () => {
    assert.ok(app.service('targets'));
  });
});
