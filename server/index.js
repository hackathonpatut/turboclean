var express= require('express');
var compression = require('compression');
var path = require('path');
var cors = require('cors');
var Sequelize = require('sequelize');
var models = require('./models');
var bodyParser = require('body-parser')
var updateAll = require('./update')

var app = express();

var static_path = path.join(__dirname, './../build');

var sequelize;

if ( process.env.DATABASE_URL != undefined ) {
  sequelize = new Sequelize( process.env.DATABASE_URL );
} else {
  sequelize = new Sequelize('sequelize', '', '', {
   dialect: 'sqlite',
   storage: path.join(__dirname, '../data/db.sqlite'),
   logging: false
  });
}

var models = models(sequelize);

app.enable('trust proxy');

app.use(compression());

app.use(bodyParser.json());

app.options('/api/targets', cors());
app.get('/api/targets', cors(), function(req, res) {
  models.targets.findAll({ include: [ models.cleanings ], limit: 50, order: 'dirtyness DESC' })
  .then(function(data) {
    res.send(data);
  })
});

app.post('/api/cleanings', cors(), function(req, res) {
  models.cleanings.create({ targetId: req.body.id, cleaner: req.body.cleaner, time: new Date().toISOString() })
  .then(function(data) {
    models.targets.update({ trashFullness: 0, usageHours: 0 }, { where: { id: req.body.id } }).then(function(data){
      models.targets.find({ id: req.body.id }).then(function(data){
        updateAll(data.xPos, data.yPos)
      })
      res.sendStatus(200);
    });
  });
});


app.route('/').get(function(req, res) {
  res.header('Cache-Control', "max-age=60, must-revalidate, private");
  res.sendFile('index.html', {
    root: static_path
  });
});

app.post('/api/button', cors(), function(req, res){
  models.targets.update(
      { dirtyness: 150 },
      { where: { sensorId: req.body.sensorId }}
    ).then(function() {
      res.sendStatus(200);
    });
});

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

app.use('/', express.static(static_path, {
    maxage: 31557600
}));

var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

});
