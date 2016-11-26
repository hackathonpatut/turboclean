var express= require('express');
var compression = require('compression');
var path = require('path');
var cors = require('cors');
var Sequelize = require('sequelize');
var models = require('./models');

var app = express();

var static_path = path.join(__dirname, './../build');

var sequelize;

if ( process.env.DATABASE_URL != undefined ) {
  sequelize = new Sequelize( process.env.DATABASE_URL );
} {
  sequelize = new Sequelize('sequelize', '', '', {
   dialect: 'sqlite',
   storage: path.join(__dirname, '../data/db.sqlite'),
   logging: false
  });
}

var models = models(sequelize);

app.enable('trust proxy');

app.use(compression());

app.options('/api/targets', cors());
app.get('/api/targets', cors(), function(req, res) {
  models.targets.findAll()
  .then(function(data) {
    res.send(data);
  })
});

app.route('/').get(function(req, res) {
    res.header('Cache-Control', "max-age=60, must-revalidate, private");
    res.sendFile('index.html', {
        root: static_path
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
