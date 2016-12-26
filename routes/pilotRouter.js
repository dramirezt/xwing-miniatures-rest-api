var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Pilot = require('../models/pilots.js');
var pilotRouter = express.Router();

pilotRouter.use(bodyParser.json());

pilotRouter.route('/')
.get(function(req, res, next){
    Pilot.find(function(err, pilots){
        if(err) return next(err);
        console.log("Returning all pilots.");
        res.contentType('application/json');
        res.json(pilots);
    });
})

.post(function(req, res, next){
    console.log(req.body);
    var p = new Pilot(req.body);
    console.log(p);
    Pilot.create(p, function (err, pilot) {
        if (err) return next(err);
        pilot.save(function(err, resp){
            if(err) return next(err);
            console.log("Pilot with id " + pilot._id + " created.");
            res.contentType('application/json');
            res.json(pilot);
        });
    });
})
;

pilotRouter.route('/:pilotId')
.get(function(req, res, next){
    Pilot.findById(req.params.pilotId, function(err, pilot){
        if(err) return next(err);
        console.log("Returning pilot with id: " + id);
        res.contentType('application/json');
        res.json(pilot);
    });
})

.put(function(req, res, next){
    Pilot.findByIdAndUpdate(req.params.pilotId, req.body, { new: true },  function(err, pilot){
        if(err) return next(err);
        pilot.save(function(err, resp){
            if(err) return next(err);
            console.log("Pilot with id " + pilot._id + " modified.");
            res.contentType('application/json');
            res.json(pilot);
        });
    });
})

.delete(function(req, res, next){
    Pilot.findByIdAndRemove(req.params.pilotId, function(err, pilot){
        if(err) return next(err);
        console.log("Pilot with id " + id + " deleted.");
        res.status(200).send('Your pilot has been deleted');
    });
})
;

module.exports = pilotRouter;
