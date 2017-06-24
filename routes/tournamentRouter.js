var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Inscription = require('../models/inscriptions');
var List = require('../models/lists');
var Tournament = require('../models/tournaments');
var Pairing = require('../models/pairings');
var tournamentRouter = express.Router();
var passport = require('passport');
var multer = require('multer');
var upload = multer({ dest: 'tmp/'});
var opencpu = require("opencpu");
var Q = require("q");

tournamentRouter.use(bodyParser.json());


tournamentRouter.route('/')
    .post(
        // passport.authenticate('jwt', { session: false }),
        function(req, res, next){
            var t = new Tournament(req.body);
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

tournamentRouter.route('/finished/count')
.get(function(req, res, next){
    Tournament.count({ finished: true }, function (err, count) {
        if(err){
            console.log("Error contando numero de elementos");
            return next(err);
        }
        res.json(count);
    })
})
;
tournamentRouter.route('/finished/:start')
.get(function(req, res, next){
    Tournament.find({ finished: true }, function(err, tournaments){
        if(err){
          console.log("Error leyendo los torneos");
          return next(err);
        }
        console.log("Returning all completedTournaments.");
        res.contentType('application/json');
        res.json(tournaments);
    }).skip(parseInt(req.params.start)).limit(10).sort('-startDate');
});

tournamentRouter.route('/following/count')
.get(function(req, res, next){
    Tournament.count({ startDate: {"$gte": new Date()} }, function (err, count) {
        if(err){
            console.log("Error contando numero de elementos");
            return next(err);
        }
        res.json(count);
    })
})
;
tournamentRouter.route('/following/:start')
    .get(function(req, res, next){
        Tournament.find({ startDate: {"$gte": new Date()} }, function(err, tournaments){
            if(err){
                console.log("Error leyendo los torneos");
                return next(err);
            }
            console.log("Returning all completedTournaments.");
            res.contentType('application/json');
            res.json(tournaments);
        }).skip(parseInt(req.params.start)).limit(10).sort('-startDate');
    });

tournamentRouter.route('/import')
    .post(function (req, res, next) {
        var obj = JSON.parse(req.body.data);
        var inscriptions = obj.tournament.players;
        var newTournament = {
            name: obj.tournament.name,
            tier: obj.tournament.format,
            startDate: obj.tournament.date,
            maxPlayers: inscriptions.length,
            finished: true,
        };
        Tournament.create(newTournament, function (err, tournament) {
            if (err) return next(err);
            tournament.save(function (err, resp) {
                if (err) {
                    console.log("Error saving tournament");
                    return next(err);
                }
                var promises = [];
                for (var i = 0; i < inscriptions.length; i++) {
                    var newInscription = inscriptions[i];
                    newInscription.tournament = tournament._id;
                    promises.push(Inscription.create(newInscription));
                }
                Q.allSettled(promises).then(
                    function (response) {
                        var promises2 = [];
                        console.log(response.length);
                        for (var j = 0; j < response.length; j++) {
                            console.log('entra');
                            if (inscriptions[j].list.pilots) {
                                for (var k = 0; k < inscriptions[j].list.pilots.length; k++) {
                                    var upgrades = [];
                                    var n;
                                    if (inscriptions[j].list.pilots[k].upgrades.title) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.title.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.title[n], slot: 'title' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.mod) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.mod.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.mod[n], slot: 'modification' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.crew) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.crew.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.crew[n], slot: 'crew' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.system) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.system.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.system[n], slot: 'system' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.illicit) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.illicit.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.illicit[n], slot: 'illicit' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.samd) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.samd.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.samd[n], slot: 'salvagedastromech' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.cannon) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.cannon.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.cannon[n], slot: 'cannon' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.tech) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.tech.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.tech[n], slot: 'tech' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.torpedo) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.torpedo.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.torpedo[n], slot: 'torpedo' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.turret) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.turret.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.turret[n], slot: 'turret' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.amd) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.amd.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.amd[n], slot: 'astromech' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.bomb) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.bomb.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.bomb[n], slot: 'bomb' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.missile) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.missile.length; n++) {
                                            upgrades.push({ name: inscriptions[j].list.pilots[k].upgrades.missile[n], slot: 'missile' })
                                        }
                                    }
                                    if (inscriptions[j].list.pilots[k].upgrades.ept) {
                                        for (n = 0; n < inscriptions[j].list.pilots[k].upgrades.ept.length; n++) {
                                            upgrades.push({
                                                name: inscriptions[j].list.pilots[k].upgrades.ept[n],
                                                slot: 'elite'
                                            })
                                        }
                                    }

                                    inscriptions[j].list.pilots[k].upgrades = upgrades;
                                }
                                var list = {
                                    inscription: response[j]._id,
                                    ships: inscriptions[j].list.pilots,
                                    faction: inscriptions[j].list.faction
                                };
                                console.log(list.ships);
                                promises2.push(List.create(list));
                            }
                        }
                        Q.allSettled(promises2).then(
                            function (response) {
                                res.contentType('application/json');
                                res.json(tournament);
                            }
                        )
                    }
                );
            });
        })
    });

tournamentRouter.route('/:tournamentId')
.get(function(req, res, next){
    Tournament.findById(req.params.tournamentId, function(err, tournament){
        if(err || !tournament ){
          console.log('Error getting tournament');
          return next(err);
        }
        console.log("Returning tournament with id: " + tournament._id);
        res.contentType('application/json');
        res.json(tournament);
    });
})

.put(function(req, res, next){
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
