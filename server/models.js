'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const targets = sequelize.define('targets', {
    xPos: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    yPos: {
      type: Sequelize.FLOAT,
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
    dirtyness: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sensorId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  targets.sync();

  const cleanings = sequelize.define('cleanings', {
    time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    cleaner: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

	targets.hasMany(cleanings);
	cleanings.belongsTo(targets);

  cleanings.sync();

  return {
    targets: targets,
    cleanings: cleanings,
  };
};
