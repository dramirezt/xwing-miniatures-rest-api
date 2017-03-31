var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Upgrade = require('../models/upgrades');
var upgradeRouter = express.Router();

upgradeRouter.use(bodyParser.json());

upgradeRouter.route('/')
.get(function(req, res, next){
    Upgrade.find(function(err, upgrades){
        if(err) return next(err);
        console.log("Returning all upgrades.");
        res.contentType('application/json');
        res.json(upgrades);
    });
})

.post(function(req, res, next){
    var upgrade = new Upgrade(req.body);
    Upgrade.create(upgrade, function (err, upgrade) {
        if (err) return next(err);
        upgrade.save(function(err, resp){
            if(err) return next(err);
            console.log("Upgrade with id " + upgrade._id + " created.");
            res.contentType('application/json');
            res.json(upgrade);
        });
    });
})
;

upgradeRouter.route('/:upgradexws')
.get(function(req, res, next){
    Upgrade.findOne(req.params.upgradexws, function(err, upgrade){
        if(!upgrade || err) return next(err);
        console.log("Returning upgrade with id: " + upgrade.keyname);
        res.contentType('application/json');
        res.json(upgrade);
    });
})

.put(function(req, res, next){
    Upgrade.findOneAndUpdate(req.params.upgradexws, req.body, { new: true },  function(err, upgrade){
        if(!upgrade || err) return next(err);
        upgrade.save(function(err, resp){
            if(err) return next(err);
            console.log("Upgrade with xws " + upgrade.xws + " modified.");
            res.contentType('application/json');
            res.json(upgrade);
        });
    });
})

.delete(function(req, res, next){
    Upgrade.findOneAndDelete(req.params.upgradexws, function(err, upgrade){
        if(!upgrade || err) return next(err);
        console.log("Upgrade with xws " + upgrade.xws + " deleted.");
        res.status(200).send('Your upgrade has been deleted');
    });
})

module.exports = upgradeRouter;
