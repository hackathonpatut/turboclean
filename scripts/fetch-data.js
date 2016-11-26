const request = require('superagent');
const moment = require('moment');
const _ = require('lodash');
const path = require('path');

const sourcesJSON = require('./data-sources');
const authorization='anVuY3Rpb25faGFja2VyOmUqQE5EXzJmb2E=';

const Sequelize = require('sequelize');

const dbPath = '../data/db.sqlite';

const sequelize = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: path.join(__dirname, dbPath),
  logging: false
});

const models = require('../src/services/api/models.js');
const targets = models(sequelize).targets;
const cleanings = models(sequelize).cleanings;

//TODO: Parametrize date
var startDate='2016-11-25';


// Drop tables and recreate them
// TODO: Only targets-table is created again
sequelize.sync({force: true}).then(function() {
  _.map(sourcesJSON, row => {
    var rand = Math.random();
		var cleanDate = '';
		if(rand < 0.33) {
			cleanDate = '2016-11-23T06:00:00.000Z'
		} else if(rand < 0.67) {
			cleanDate = '2016-11-24T10:12:00.000Z'
		} else {
			cleanDate = '2016-11-25T06:30:00.000Z'
		}
		
    var target = targets.create({
      xPos: row.x,
      yPos: row.y,
      type: row.type,
      sensorID: row.data_source,
      name: row.name,
      usageHours: 0,
      trashFullness: 0,
      dirtyness: 0
    }).then(function(target) {
				target.createCleaning({
				time: cleanDate,
				cleaner: 'Patu'
			});
		});
  });
});


// Uncomment to fetch data
/*
_.map(sourcesJSON, row => {
  getData(row.data_source, startDate);
})
*/

// TODO: Save fetched sensor data to tables
function getData(source, startDate) {

  var endDate = moment(startDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
  
  var URL='https://tieto.iottc.tieto.com/measurement/measurements?source=' + source + '&revert=true&dateTo=' + endDate + '&pageSize=100&currentPage=1&dateFrom=' + startDate;
  
  request
    .get(URL)
    .set('Accept', 'application/json')
    .set('Authorization', 'Basic ' + authorization)
    .end(function(err, res){
      if (err || !res.ok) {
        console.log('Couldn\'t get data for source ID ' + source);
      } else {
        responseText = JSON.stringify(res.body);
      }
  });
 
}