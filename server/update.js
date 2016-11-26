var Sequelize = require('sequelize');
const path = require('path');
const dbPath = '../data/db.sqlite';

var sequelize;

if ( process.env.DATABASE_URL != undefined ) {
  sequelize = new Sequelize( process.env.DATABASE_URL );
} else {
  sequelize = new Sequelize('sequelize', '', '', {
   dialect: 'sqlite',
   storage: path.join(__dirname, dbPath),
   logging: false
  });
}

const models = require('../server/models.js');
const targets = models(sequelize).targets;
const cleanings = models(sequelize).cleanings;

updateAll(0,0);

function updateAll(x, y) {
	targets.findAll()
	.then(function(found) {
		for(t in found) {
			const id = parseInt(t, 10) + 1;
			targets.find({
				where: {
					id: id
				}
			}).then(function(target) {
				var trash = target.get('trashFullness');
				var hours = target.get('usageHours');
				var xPos = target.get('xPos');
				var yPos = target.get('yPos');
				var dist = Math.sqrt(Math.pow(xPos - x, 2) + Math.pow(yPos - y, 2));
				var hourDirtyness = hours / 14.0;
				if(hourDirtyness < 0.6) hourDirtyness = 0.0;
				
				// TODO maybe implement latest cleaning attribute also?
				var dirtyness = Math.floor(Math.max(trash, hourDirtyness * 100));
				if(dist < 20) dirtyness = Math.min(100, dirtyness + 10);
				else {
					var multiplier = Math.floor(dist / 20);
					dirtyness = Math.max(0, dirtyness - multiplier * 5);
				}
				var wrapper = {id: target.get('id'), dirty: dirtyness};
				return wrapper;
			}).then(function(wrapper) {
				targets.update(
					{ dirtyness: wrapper['dirty'] },
					{ where: { id: wrapper['id'] }}
				);
			});
		}
	});
	
}