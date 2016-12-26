var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Ship = require('../models/ships');
var Pilot = require('../models/pilots');
var shipRouter = express.Router();

shipRouter.use(bodyParser.json());

shipRouter.route('/')
.get(function(req, res, next){
    Ship.find(function(err, ships){
        if(err) return next(err);
        console.log("Returning all ships.");
        res.contentType('application/json');
        res.json(ships);
    });
})

.post(function(req, res, next){
    var ship = new Ship(req.body);
    Ship.create(ship, function (err, ship) {
        if (err) return next(err);
        ship.save(function(err, resp){
            if(err) return next(err);
            console.log("Ship with id " + ship._id + " created.");
            res.contentType('application/json');
            res.json(ship);
        });
    });
})
;

shipRouter.route('/:shipKeyname')
.get(function(req, res, next){
    Ship.findOne({ keyname: req.params.shipKeyname }, function(err, ship){
        if(err) return next(err);
        console.log("Returning ship with id: " + ship.keyname);
        res.contentType('application/json');
        res.json(ship);
    });
})

.put(function(req, res, next){
    Ship.findOneAndUpdate({ keyname: req.params.shipKeyname }, req.body, { new: true },  function(err, ship){
        if(err) return next(err);
        ship.save(function(err, resp){
            if(err) return next(err);
            console.log("Ship with id " + ship._id + " modified.");
            res.contentType('application/json');
            res.json(ship);
        });
    });
})

.delete(function(req, res, next){
    Ship.findByIdAndRemove(req.params.shipKeyname, function(err, ship){
        if(err) return next(err);
        console.log("Ship with id " + ship._id + " deleted.");
        res.status(200).send('Your ship has been deleted');
    });
})

shipRouter.route('/:shipKeyname/pilots')
.get(function (req, res, next) {
  console.log('entra');
  Ship.findOne({ keyname: req.params.shipKeyname }, function (err, ship){
    if (err) return next(err);
    if (ship) {
      Pilot.find({ ship: ship._id }, function (err, pilotlist) {
        if (err) return next(err);
        console.log('Returning pilots for ' + ship.keyname);
        res.contentType('application/json');
        res.json(pilotlist);
      });
    }
  })
})

;

module.exports = shipRouter;
