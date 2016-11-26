const request = require('superagent');
const moment = require('moment');
const _ = require('lodash');
const path = require('path');

const sourcesJSON = require('./data-sources');
const authorization='anVuY3Rpb25faGFja2VyOmUqQE5EXzJmb2E=';

const Sequelize = require('sequelize');

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

//TODO: Parametrize date
var startDate='2016-11-22';

sequelize.sync({force: true}).then(function() {
  _.map(sourcesJSON, row => {
    var rand = Math.random();
		var cleanDate = '';
		if(rand < 0.33) {
			cleanDate = '2016-11-22T06:00:00.000Z'
		} else if(rand < 0.67) {
			cleanDate = '2016-11-22T10:12:00.000Z'
		} else {
			cleanDate = '2016-11-22T06:30:00.000Z'
		}

    console.log('Imported room ' + row.name)

    var target = targets.create({
      xPos: row.x,
      yPos: row.y,
      type: row.type,
      sensorID: row.data_source,
      name: row.name,
      usageHours: 0,
      trashFullness: Math.floor(Math.random()*100),
      dirtyness: 0
    }).then(function(target) {
				target.createCleaning({
				time: cleanDate,
				cleaner: 'Patu'
			});
		});
  });
}).then(function() {
	targets.sync().then(function() {
		cleanings.sync().then(function() {
			// Get usage data for rooms
			_.map(sourcesJSON, row => {
				getData(row.data_source, startDate);
			});
		});
	});
});
		

function getData(source, startDate) {

  var endDate = moment(startDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')

  var URL = 'https://tieto.iottc.tieto.com/measurement/measurements?source=' + source + '&revert=true&dateTo=' + endDate + '&pageSize=100&currentPage=1&dateFrom=' + startDate;

  request
    .get(URL)
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic ' + authorization)
    .end(function(err, res){
      if (err || !res.ok) {
        console.log('Couldn\'t get data for source ID ' + source);
      } else {

        var measurements = res.body.measurements;

        // Bail out if there's nothing to read
        if (measurements.size === 0) {
          return false;
        }

        measurements = _.orderBy(measurements, 'time', 'asc');

        var totalTime = 0;
        var lastTimestamp = null;
        var sensorID = null;
        var cleanTimestamp = null;
				
				targets.find({
					where: {
						sensorID: source
					}
				}).then(function(target) {
					cleanings.max('time', {
						where: {
							targetId: target.get('id')
						}
					}).then(function(maxValue) {
						cleanTimestamp = maxValue;
					}).then(function() {
						// Required as the list may hold duplicates
						var lastValue = -1;

						_.map(measurements, measurement => {

							// On first starting element, set sensorID
							if (lastTimestamp == null && measurement.value === 1) {
								sensorID = measurement.source.id;
							}
							
							if (sensorID !== null && lastValue !== measurement.value) {
								// On value 1, start recording
								if (measurement.value === 1 && (moment.duration(moment.utc(measurement.time).diff(moment.utc(cleanTimestamp))) > 0)) {
									lastTimestamp = measurement.time;
									lastValue = measurement.value;
								// On value 0, stop recording and increment totaltime
								} else if (measurement.value === 0) {
									var difference = moment.duration(moment.utc(measurement.time).diff(moment.utc(lastTimestamp)));
									totalTime += difference.asMinutes() / 60;
									lastValue = measurement.value;
								}
							}
						});
						// Update database entry for sensor
						targets.bulkCreate([]).then(function() {
							return targets.update(
								{ usageHours: totalTime },
								{ where: { sensorID: sensorID }}
							);
						})
					});
				});
      }
  });

}
