var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Pairing = require('../models/pairings.js');
var pairingRouter = express.Router();

pairingRouter.use(bodyParser.json());

pairingRouter.route('/:tournamentId/pairings')
.get(function(req, res, next){
    Pairing.find({ tournament: req.params.tournamentId }, function(err, pairings){
        if(err) return next(err);
        console.log("Returning all pairings.");
        res.contentType('application/json');
        res.json(pairings);
    });
})

.post(function(req, res, next){
    var pairing = new Pairing(req.body);
    Pairing.create(pairing, function (err, pairing) {
        if (err) return next(err);
        pairing.save(function(err, resp){
            if(err) return next(err);
            console.log("Pairing with id " + pairing._id + " created.");
            res.contentType('application/json');
            res.json(pairing);
        });
    });
})

.delete(function (req, res, next) {
    Pairing.remove({ tournament: req.params.tournamentId }, function (err, tournament){
      if(err) return next(err);
      res.status(200).send('Pairings deleted for your tournament');
    })
})
;

pairingRouter.route('/:tournamentId/pairings/:pairingId')
.get(function(req, res, next){
    Pairing.findById(req.params.pairingId, function(err, pairing){
        if(err) return next(err);
        console.log("Returning pairing with id: " + pairing._id);
        res.contentType('application/json');
        res.json(pairing);
    });
})

.put(function(req, res, next){
    Pairing.findByIdAndUpdate(req.params.pairingId, req.body, { new: true },  function(err, pairing){
        if(err) return next(err);
        pairing.save(function(err, resp){
            if(err) return next(err);
            console.log("Pairing with id " + pairing._id + " modified.");
            res.contentType('application/json');
            res.json(pairing);
        });
    });
})

.delete(function(req, res, next){
    Pairing.findByIdAndRemove(req.params.pairingId, function(err, pairing){
        if(err) return next(err);
        res.status(200).send('Your pairing has been deleted');
    });
})
;

module.exports = pairingRouter;
