var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Faction = require('../models/factions');
var factionRouter = express.Router();

factionRouter.use(bodyParser.json());

factionRouter.route('/')
.get(function(req, res, next){
    Faction.find(function(err, factions){
        if(err) return next(err);
        console.log("Returning all factions.");
        res.json(factions);
    });
})

.post(function(req, res, next){
    Faction.create(req.body, function (err, faction) {
                        if (err) return next(err);
                        faction.save(function(err, resp){
                            if(err) return next(err);
                            console.log("Faction with id " + faction._id + "created.");
                            res.json({
                                success: true,
                                status: 200,
                                message: 'Your faction has been created.'
                            });
                        });
                    });
})
;


factionRouter.route('/:factionId')
.get(function(req, res, next){
    Faction.findById(req.params.factionId, function(err, faction){
        if(err) return next(err);
        console.log("Returning faction with id: " + faction._id);
        res.json(faction);
    });
})

.put(function(req, res, next){
    Faction.findByIdAndUpdate(req.params.factionId, req.body, { new: true },  function(err, faction){
        if(err) return next(err);
        faction.save(function(err, resp){
            if(err) return next(err);
            console.log("Faction with id " + faction._id + " modified.");
            res.json(faction);
        });
    });
})

.delete(function(req, res, next){
    Faction.findByIdAndRemove(req.params.factionId, function(err, faction){
        if(err) return next(err);
        console.log("Faction with id " + faction._id + " deleted.");
        res.json({
            success: true,
            status: 200,
            message: 'Your faction has been deleted.'
        });
    });
})
;

module.exports = factionRouter;
