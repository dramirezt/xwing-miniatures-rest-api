var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/users');
var userRouter = express.Router();
var jwt = require('jwt-simple');

userRouter.use(bodyParser.json());

userRouter.route('/')
.get(function(req, res, next) {
    User.find(function(err, users){
        if(err) return next(err);
        console.log('Returning all users.');
        res.json(users);
    });
})

.post(function(req, res, next) {
    var user = new User(req.body);
    User.create(user, function(err, user) {
        if (err) return next(err);
        user.save(function(err,user) {
            if(err) return next(err);
            console.log("User with id " + user._id + " created.");
            res.contentType('application/json');
            res.json(user);
        });
    });
})
;

userRouter.route('/current')
.get(function(req, res, next){
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secretKey);
    User.findOne( { username: decoded.username }, function(err, user){
        if(err) return next(err);
        console.log("Returning user: " + user.username);
        res.contentType('application/json');
        res.json(user);
    });
  }
})


userRouter.route('/:userId')
.get(function(req, res, next){
    User.findById(req.params.userId, function(err, user){
        if(err) return next(err);
        console.log("Returning user with id: " + user._id);
        res.contentType('application/json');
        res.json(user);
    });
})

.put(function(req, res, next){
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true },  function(err, user){
        if(err) return next(err);
        if(user._id != req.params.userId){
            console.log('You can\'t change others users data');
            res.json({
                success: false,
                status: 403,
                message: 'You are not this user.'
            });
        }
        else{
            user.save(function(err, user){
                if(err) return next(err);
                console.log("User with id " + user._id + " modified.");
                res.json(user);
            });
        }
    });
})

.delete(function(req, res, next){
    User.findByIdAndRemove(req.params.userId, function(err, user){
        if(err) return next(err);
        console.log("User with id " + user._id + " deleted.");
    });
})
;

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

module.exports = userRouter;
