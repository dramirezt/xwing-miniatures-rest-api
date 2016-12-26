var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var login = require('connect-ensure-login');
var User = require('../models/users');
var apiRouter = express.Router();
var config = require('../config')
var jwt = require('jwt-simple')

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
