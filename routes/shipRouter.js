var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Ship = require('../models/ships');
var Pilot = require('../models/pilots');
var shipRouter = express.Router();
var opencpu = require("opencpu");

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

shipRouter.route('/:shipKeyname/statistics/attack')
.get(function (req, res, next) {
  Ship.findOne({ keyname: req.params.shipKeyname }, function (err, ship) {
    if (err) return next(err);
    if (ship) {
      var seq = [];
      for(var i = 0; i <= ship.attack; i++) {
        seq.push(i);
      }
      var attackProbability = [ (4/8), (6/8), ((6/8) + (1 - 6/8)*(6/8))];
      var results = [];
      opencpu.rCall("/library/stats/R/dbinom/json", {
        x: seq,
        size: ship.attack,
        prob: attackProbability[0]
      }, function (err, data) {
        if (!err) {
          for (var i = 0; i < data.length; i++) {
            data[i] = Number((data[i]*100).toFixed(2));
          }
          results.push(data);
          opencpu.rCall("/library/stats/R/dbinom/json", {
            x: seq,
            size: ship.attack,
            prob: attackProbability[1]
          }, function (err, data) {
            if (!err) {
              for (var i = 0; i < data.length; i++) {
                data[i] = Number((data[i]*100).toFixed(2));
              }
              results.push(data);
              opencpu.rCall("/library/stats/R/dbinom/json", {
                x: seq,
                size: ship.attack,
                prob: attackProbability[2]
              }, function (err, data) {
                if (!err) {
                  for (var i = 0; i < data.length; i++) {
                    data[i] = Number((data[i]*100).toFixed(2));
                  }
                  results.push(data);
                  res.json(results);
                } else {
                    console.log("opencpu call failed.");
                    return err;
                }
              });
            } else {
              console.log("opencpu call failed.");
                return err;
            }
          });
        } else {
          console.log("opencpu call failed.");
            return err;
        }
      });
    }
  })
})

shipRouter.route('/:shipKeyname/statistics/agility')
.get(function (req, res, next) {
  Ship.findOne({ keyname: req.params.shipKeyname }, function (err, ship) {
    if (err) return next(err);
    if (ship) {
      var seq = [];
      for(var i = 0; i <= ship.agility; i++) {
        seq.push(i);
      }
      var defenseProbability = [ (3/8), (5/8) ];
      var results = [];
      opencpu.rCall("/library/stats/R/dbinom/json", {
        x: seq,
        size: ship.agility,
        prob: defenseProbability[0]
      }, function (err, data) {
        if (!err) {
          for (var i = 0; i < data.length; i++) {
            data[i] = Number((data[i]*100).toFixed(2));
          }
          results.push(data);
          opencpu.rCall("/library/stats/R/dbinom/json", {
            x: seq,
            size: ship.agility,
            prob: defenseProbability[1]
          }, function (err, data) {
            if (!err) {
              for (var i = 0; i < data.length; i++) {
                data[i] = Number((data[i]*100).toFixed(2));
              }
              results.push(data);
              res.json(results);
            } else {
              console.log("opencpu call failed.");
              return err;
            }
          });
        } else {
          console.log("opencpu call failed.");
          return err;
        }
      });
    }
  })
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
