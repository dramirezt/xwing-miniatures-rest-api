/**
 * X-Wing Miniatures REST API Main application file
 * Developer: Daniel Ramírez Torres
 * Date: December 2016
 */
var express = require('express')
  , passport = require('passport')
  , errorHandler = require('errorhandler')
  , path = require('path')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , mongoose = require('mongoose')
  , config = require('./config')
  , db = mongoose.connection
  , app = express()

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(req.status);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);


// Passport configuration

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
require('./passport')(passport);

app.use(passport.session());
app.use(errorHandler());

var User = require('./models/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// use morgan to log request to the console
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connecting to mongodb
mongoose.connect(config.database);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to server");
});

// setting secret variable
// app.set('secretKey', config.secretKey);

// import routes
var apiRouter = require('./routes/apiRouter');
var factionRouter = require('./routes/factionRouter');
var listRouter = require('./routes/listRouter');
var pilotRouter = require('./routes/pilotRouter');
var shipRouter = require('./routes/shipRouter');
var tournamentRouter = require('./routes/tournamentRouter');
var inscriptionRouter = require('./routes/inscriptionRouter');
var pairingRouter = require('./routes/pairingRouter');
var upgradeRouter = require('./routes/upgradeRouter');
var userRouter = require('./routes/userRouter');

// initialize routes
app.use('/api', apiRouter);
app.use('/api/factions', factionRouter);
app.use('/api/lists', listRouter);
app.use('/api/pilots', pilotRouter);
app.use('/api/ships', shipRouter);
app.use('/api/tournaments', tournamentRouter);
app.use('/api/tournaments', inscriptionRouter);
app.use('/api/tournaments', pairingRouter);
app.use('/api/upgrades', upgradeRouter);
app.use('/api/users', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// app.use(function($httpProvider){
//     $httpProvider.defaults.useXDomain = true;
// });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start the server
app.listen(config.port, function() {
    console.log('X-Wing Miniatures REST API listening on port ' + config.port);
});
