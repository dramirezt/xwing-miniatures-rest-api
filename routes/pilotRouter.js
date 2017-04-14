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
            console.log("Pilot with xws " + pilot.xws + " created.");
            res.contentType('application/json');
            res.json(pilot);
        });
    });
})
;

pilotRouter.route('/:pilotxws')
.get(function(req, res, next){
    Pilot.findOne({ 'xws': req.params.pilotxws }, function(err, pilot){
        if(!pilot || err) return next(err);
        console.log("Returning pilot with xws: " + pilot.xws);
        res.contentType('application/json');
        res.json(pilot);
    });
})

.put(function(req, res, next){
    Pilot.findOneAndUpdate({ 'xws': req.params.pilotxws }, req.body, { new: true },  function(err, pilot){
        if(!pilot || err) return next(err);
        pilot.save(function(err, resp){
            if(err) return next(err);
            console.log("Pilot with xws " + pilot.xws + " modified.");
            res.contentType('application/json');
            res.json(pilot);
        });
    });
})

.delete(function(req, res, next){
    Pilot.findOneAndDelete({ 'xws': { 'xws': req.params.pilotxws } }, function(err, pilot){
        if(!pilot || err) return next(err);
        console.log("Pilot with xws " + pilot.xws + " deleted.");
        res.status(200).send('Your pilot has been deleted');
    });
})
;

module.exports = pilotRouter;
