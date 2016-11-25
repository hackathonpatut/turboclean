'use strict';

const service = require('feathers-sequelize');

module.exports = function(){
  const app = this;

  const models = require('./models');

  const targets = {
    Model: models(app.sequelize).targets,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/api/targets', service(targets));
  const targetsService = app.service('/api/targets');

  const cleanings = {
    Model: models(app.sequelize).cleanings,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/api/cleanings', service(cleanings));
  const cleaningsService = app.service('/api/cleanings');
};
