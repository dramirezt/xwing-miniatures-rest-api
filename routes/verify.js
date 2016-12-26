var User = require('../models/users');
var config = require('../config.js');
var passport = require('passport');

exports.verifyUser = function (req, res, next) {
  // TODO: check if user is logged in
}

exports.verifyOwner = function(req, res, next){
    // TODO: check if user is the owner of the resource
    return true;
};

exports.verifyOrganizer = function(req, res, next){
    // TODO: check if user is organizer
    // check decoded parameter from request
    // if(req.decoded.organizer || req.decoded.admin ) return next();
    // else{
    //     var err = new Error('You are not an organizer!');
    //     err.status = 403;
    //     return next(err);
    // }
    return true;
};

exports.verifyAdmin = function(req, res, next){
    // check decoded parameter from request
    // if(req.decoded.admin) return next();
    // else{
    //     var err = new Error('You are not an admin!');
    //     err.status = 403;
    //     return next(err);
    // }
    return true;
};
