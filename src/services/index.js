'use strict';
const api = require('./api');

module.exports = function() {
  const app = this;

  app.configure(api);
};
