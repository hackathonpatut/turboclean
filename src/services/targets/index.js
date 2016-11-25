'use strict';

const service = require('feathers-sequelize');
const targets = require('./targets-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: targets(app.sequelize),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/targets', service(options));

  // Get our initialize service to that we can bind hooks
  const targetsService = app.service('/targets');

  // Set up our before hooks
  targetsService.before(hooks.before);

  // Set up our after hooks
  targetsService.after(hooks.after);
};
