var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Tournament = require('../models/tournaments.js');
var Pairing = require('../models/pairings.js');
var tournamentRouter = express.Router();
var passport = require('passport');
var multer = require('multer');
var upload = multer({ dest: 'tmp/'});
var opencpu = require("opencpu");

tournamentRouter.use(bodyParser.json());

tournamentRouter.route('/')
.get(function(req, res, next){
    var start = 0;
    if (req.body) start = req.body;
    Tournament.find(function(err, tournaments){
        if(err){
          console.log("Error leyendo los torneos");
          return next(err);
        }
        console.log("Returning all tournaments.");
        res.contentType('application/json');
        res.json(tournaments);
    });
})

.post(
  // passport.authenticate('jwt', { session: false }),
  function(req, res, next){
    var t = new Tournament(req.body);
    console.log(t);
    Tournament.create(t, function (err, tournament) {
        if (err) return next(err);
        tournament.save(function(err, resp){
            if(err){
                console.log("Error saving tournament");
                return next(err);
            }
            console.log("Tournament with id " + tournament._id + " created.");
            res.contentType('application/json');
            res.json(tournament);
        });
    });
})
;

tournamentRouter.route('/import')
.post(
    function (req, res, next) {
        opencpu.rCall("/library/xwingjson/R/migrate_from_csv/json", {
            source: req.body.data
        }, function (err, data) {
            if (!err) {
                res.send(data);
            } else {
                console.log("opencpu call failed.");
                next(err);
            }
        });
    }
);

tournamentRouter.route('/:tournamentId')
.get(function(req, res, next){
    Tournament.findById(req.params.tournamentId, function(err, tournament){
        if(err | !tournament ){
          console.log('Error getting tournament');
          return next(err);
        }
        console.log("Returning tournament with id: " + tournament._id);
        res.contentType('application/json');
        res.json(tournament);
    });
})

.put(function(req, res, next){
    console.log('------------ UPDATE TOURNAMENT ---------------');
    console.log(req.body);
    Tournament.findByIdAndUpdate(req.params.tournamentId, req.body, { new: true },  function(err, tournament){
            if(err) return next(err);
            tournament.save(function(err, resp){
                if(err) return next(err);
                console.log("Tournament with id " + tournament._id + " modified.");
                res.contentType('application/json');
                res.json(tournament);
            });
    });
})

.delete(function(req, res, next){
    Tournament.findByIdAndRemove(req.params.tournamentId, function(err, tournament){
        if(err) return next(err);
        res.contentType('application/json');
        res.json({
            success: true,
            status: 200,
            message: 'Your tournament has been deleted.',
        });
    });
})
;

tournamentRouter.route('/:tournamentId/haspairings')
.get(function (req, res, next){
  Pairing.findOne({ tournament: req.params.tournamentId }, function (err, pairing) {
    if (err) return next(err);
    res.status(200).send('Your tournament has pairings created');
  });
})
;

module.exports = tournamentRouter;
