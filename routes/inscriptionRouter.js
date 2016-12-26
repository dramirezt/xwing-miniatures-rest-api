var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Inscription = require('../models/inscriptions');
var Tournament = require('../models/tournaments');
var inscriptionRouter = express.Router();

inscriptionRouter.use(bodyParser.json());

inscriptionRouter.route('/inscriptions/:userId')
.get(function(req, res, next){
  Inscription.find({ player: req.params.userId }, function(err, myInscriptions) {
    if (err) return next(err);
    console.log('Returning your inscriptions');
    res.contentType('application/json');
    res.json(myInscriptions);
  })
})

inscriptionRouter.route('/:tournamentId/inscriptions')
.get(function(req, res, next){
    Inscription.find({ tournament: req.params.tournamentId }, function(err, inscriptions){
        if(err) return next(err);
        console.log("Returning all inscriptions.");
        res.contentType('application/json');
        res.json(inscriptions);
    });
})

.post(function(req, res, next){
    var inscription = new Inscription(req.body);
    var t = inscription.tournament;
    Tournament.findById(t, function(err, tournament) {
      if (err) return next(err);
      if(tournament.finished) {
        res.status(500).send('Tournament already finished!');
      } else if(inscription.player){
        Inscription.find({ player: inscription.player, tournament: inscription.tournament}, function (err, inscriptionAux){
          if (err) return next(err);
          if (inscriptionAux.length) {
            console.log('Error, player already in the tournament');
            res.status(500).send('You already joined the tournament');
          } else {
            Inscription.create(inscription, function (err, inscription) {
              if (err) return next(err);
              inscription.save(function(err, resp){
                if(err) return next(err);
                console.log("Inscription with id " + inscription._id + " created.");
                res.contentType('application/json');
                res.json(inscription);
              });
            });
          }
        });
      } else {
        Inscription.create(inscription, function (err, inscription) {
          if (err) return next(err);
          inscription.save(function(err, resp){
            if(err) return next(err);
            console.log("Inscription with id " + inscription._id + " created.");
            res.contentType('application/json');
            res.json(inscription);
          });
        });
      }
    });
})

.delete(function (req, res, next) {
    Inscription.remove({ tournament: req.params.tournamentId }, function (err, tournament){
      if(err) return next(err);
      console.log(tournament + ' inscriptions deleted in tournament ' + req.params.tournamentId);
      res.status(200).send('Inscriptions deleted for your tournament');
    });
})



inscriptionRouter.route('/:tournamentId/inscriptions/:inscriptionId')
.get(function(req, res, next){
    Inscription.findById(req.params.inscriptionId, function(err, inscription){
        if(err) return next(err);
        console.log("Returning inscription with id: " + inscription._id);
        res.contentType('application/json');
        res.json(inscription);
    });
})

.put(function(req, res, next){
    Inscription.findByIdAndUpdate(req.params.inscriptionId, req.body, { new: true },  function(err, inscription){
        if(err) return next(err);
        inscription.save(function(err, resp){
            if(err) return next(err);
            console.log("Inscription with id " + inscription._id + " modified.");
            res.contentType('application/json');
            res.json(inscription);
        });
    });
})

.delete(function(req, res, next){
    Inscription.findByIdAndRemove(req.params.inscriptionId, function(err, inscription){
        if(err) return next(err);
        res.status(200).send('The inscription has been deleted');
    });
})
;

module.exports = inscriptionRouter;
