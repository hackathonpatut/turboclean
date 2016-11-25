'use strict';

// targets-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const targets = sequelize.define('targets', {
    xPos: {
      type: Sequelize.STRING,
      allowNull: false
    },
    yPos: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    usageHours: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    trashFullness: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    lastCleaning: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dirtyness: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  targets.sync();

  return targets;
};
