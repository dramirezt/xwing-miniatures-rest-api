var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var login = require('connect-ensure-login');
var User = require('../models/users');
var apiRouter = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');
var Inscription = require('../models/inscriptions');

apiRouter.use(bodyParser.json());

apiRouter.route('/')
.get(
  passport.authenticate('jwt', { session: false }),
  function(req, res){
    var token = getToken(req.headers);
    if (token) {
      res.json(
          { message: 'Welcome to the X-Wing Miniatures REST API ' + ' v' + (require('../package').version)}
      );
    } else {
      res.json({ status: 403, statusText: 'No token provided' });
    }
})
;

apiRouter.route('/inscriptions')
    .get(function(req, res, next) {
        Inscription.find(function (err, inscriptions) {
            if (err) return next(err);
            res.contentType('application/json');
            res.json(inscriptions);
        })
    })

    apiRouter.route('/inscriptions/migrate/:inscriptionId')
    .put(function(req, res, next) {
        Inscription.findByIdAndUpdate(req.params.inscriptionId, req.body, { new: true },  function(err, inscription){
            if(err) return next(err);
            inscription.save(function(err, resp){
                if(err) return next(err);
                console.log("Inscription with id " + inscription._id + " modified.");
                res.contentType('application/json');
                res.json(inscription);
            });
        });
    })

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.route('/authenticate')
.post(function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) return next(err);
    if (!user) {
      res.json({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      if(user.comparePassword(req.body.password)) {
        var token = jwt.encode(user, config.secretKey);
        res.json({ success: true, token: 'JWT ' + token, username: user.username });
      } else {
        res.json({ success: false, message:'Authentication failed. Wrong password'});
      }
    }
  });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = apiRouter;
