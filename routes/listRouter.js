var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var List = require('../models/lists');
var Pilot = require('../models/pilots');
var Inscription = require('../models/inscriptions');
var Tournament = require('../models/tournaments');
var opencpu = require('opencpu');

var listRouter = express.Router();

listRouter.route('/:inscriptionId')
.get(function (req, res, next){
  List.find({ inscription: req.params.inscriptionId }, function(err, list) {
    if (err) return next(err);
    console.log('Returning list of inscription ' + req.params.inscriptionId);
    res.contentType('application/json');
    res.json(list);
  })
})

listRouter.route('/')
.get(function(req, res, next){
    List.find(function(err, lists){
        if(err){
          console.log("Error getting the lists.");
          return next(err);
        }
        console.log("Returning all lists.");
        res.contentType('application/json');
        res.json(lists);
    });
}

    .delete(function (req, res, next) {
        List.remove(function (err, tournament){
            if(err) return next(err);
            res.status(200).send('Pairings deleted for your tournament');
        })
    })

.post(function (req, res, next) {
  var list = new List(req.body);
  List.create(list, function (err, list) {
    if (err) return next(err);
    list.save(function(err, resp){
      if(err) return next(err);
      console.log("List with id " + list._id + "created.");
      res.contentType('application/json');
      res.json(list);
      // res.status(200).send('Your list has been created');
    });
  });
})

listRouter.route('/:listId')
.put(function (req, res, next){
  List.findByIdAndUpdate(req.params.listId, req.body, { new: true },  function(err, list){
    if(err) return next(err);
    list.save(function(err, resp){
      if(err) return next(err);
      console.log("List with id " + list._id + " modified.");
      res.contentType('application/json');
      res.json(list);
    });
  });
})

.delete(function (req, res, next){
  List.findByIdAndRemove(req.params.listId, function(err, list){
    if(err) return next(err);
    res.status(200).send('The list has been deleted');
  });
})
;

listRouter.route('/count/rebel')
    .get(function(req, res, next){
        List.count({ faction: 'Rebel Alliance' }, function (err, count) {
            if(err){
                console.log("Error contando numero de elementos");
                return next(err);
            }
            res.json(count);
        })
    })
;

listRouter.route('/count/empire')
    .get(function(req, res, next){
        List.count({ faction: 'Galactic Empire' }, function (err, count) {
            if(err){
                console.log("Error contando numero de elementos");
                return next(err);
            }
            res.json(count);
        })
    })
;

listRouter.route('/count/scum')
    .get(function(req, res, next){
        List.count({ faction: 'Scum and Villainy' }, function (err, count) {
            if(err){
                console.log("Error contando numero de elementos");
                return next(err);
            }
            res.json(count);
        })
    })
;

listRouter.route('/stats/shipuse')
    .get(function(req, res, next){
        List.find(function(err, lists) {
            if (err) return next(err);
            var ships = [];
            for(var i = 0; i < lists.length; i++) {
                for(var j = 0; j < lists[i].ships.length; j++) {
                    ships.push(lists[i].ships[j].ship + ' - ' + lists[i].faction);
                }
            }
            opencpu.rCall("/library/xwingjson/R/get_top10/json", {
                source: ships
            }, function (err, data) {
                if (!err) {
                    res.send(data);
                } else {
                    console.log("opencpu call failed.");
                    next(err);
                }
            });
            // var cleanPilots = [];
            // var pilots = [];
            // for(var i = 0; i < lists.length; i++) {
            //     for(var j = 0; j < lists[i].ships.length; j++) {
            //         if(lists[i].faction !== undefined) console.log(lists[i].faction);
            //         cleanPilots.push(lists[i].ships[j].pilot);
            //         pilots.push(lists[i].ships[j].pilot + " - " + lists[i].faction);
            //     }
            // }
            // pilots.sort();
            // var counts = [];
            // cleanPilots = uniqueArray = cleanPilots.filter(function(elem, pos) {
            //     return cleanPilots.indexOf(elem) == pos;
            // })
            // pilots.forEach(function(x) {
            //     counts[x] = (counts[x] || 0) + 1;
            // });
            // Pilot.find({ name: { $in: cleanPilots }}, function (err, fullPilots){
            //     if(err) return next(err);
            //     var test = [];
            //     console.log(fullPilots.length);
            //     for (var i = 0; i < fullPilots.length; i++) {
            //         for (var j = 0; j < counts[fullPilots[i].name]; j++) {
            //             test.push(fullPilots[i].ship + ' - ' + fullPilots[i].faction);
            //         }
            //     }
            //     opencpu.rCall("/library/xwingjson/R/get_top10/json", {
            //         source: test
            //     }, function (err, data) {
            //         if (!err) {
            //             res.send(data);
            //         } else {
            //             console.log("opencpu call failed.");
            //             next(err);
            //         }
            //     });
            // });
        })
    });

listRouter.route('/stats/shipuse/:tournamentId')
    .get(function(req, res, next){
        Inscription.find({ tournament: req.params.tournamentId }, function (err, inscriptions) {
            if (err) return next(err);
            List.find({ inscription: { $in: inscriptions } }, function(err, lists) {
                if (err) return next(err);
                var ships = [];
                for(var i = 0; i < lists.length; i++) {
                    for(var j = 0; j < lists[i].ships.length; j++) {
                        ships.push(lists[i].ships[j].ship + ' - ' + lists[i].faction);
                    }
                }
                opencpu.rCall("/library/xwingjson/R/get_top10/json", {
                    source: ships
                }, function (err, data) {
                    if (!err) {
                        res.send(data);
                    } else {
                        console.log("opencpu call failed.");
                        next(err);
                    }
                });
                // var pilots = [];
                // for(var i = 0; i < lists.length; i++) {
                //     for(var j = 0; j < lists[i].ships.length; j++) {
                //         pilots.push(lists[i].ships[j].pilot);
                //     }
                // }
                // pilots.sort();
                // var counts = [];
                // pilots.forEach(function(x) {
                //     counts[x] = (counts[x] || 0) + 1;
                // });
                // Pilot.find({ name: { $in: pilots }}, function (err, fullPilots){
                //     if(err) return next(err);
                //     var test = [];
                //     for (var i = 0; i < fullPilots.length; i++) {
                //         for (var j = 0; j < counts[fullPilots[i].name]; j++) {
                //             test.push(fullPilots[i].ship + ' - ' + fullPilots[i].faction);
                //         }
                //     }
                //     opencpu.rCall("/library/xwingjson/R/get_top10/json", {
                //         source: test
                //     }, function (err, data) {
                //         if (!err) {
                //             res.send(data);
                //         } else {
                //             console.log("opencpu call failed.");
                //             next(err);
                //         }
                //     });
                // });
            })
        });
    });


listRouter.route('/stats/pilotuse')
    .get(function(req, res, next){
        List.find(function(err, lists) {
            if (err) return next(err);
            var pilots = [];
            for(var i = 0; i < lists.length; i++) {
                for(var j = 0; j < lists[i].ships.length; j++) {
                    pilots.push(lists[i].ships[j].pilot + ' - ' + lists[i].faction);
                }
            }
            opencpu.rCall("/library/xwingjson/R/get_top10/json", {
                source: pilots
            }, function (err, data) {
                if (!err) {
                    res.send(data);
                } else {
                    console.log("opencpu call failed.");
                    next(err);
                }
            });
        })
    });

listRouter.route('/stats/pilotuse/:tournamentId')
    .get(function(req, res, next){
        Inscription.find({ tournament: req.params.tournamentId }, function (err, inscriptions) {
            if (err) return next(err);
            List.find({ inscription: { $in: inscriptions } }, function(err, lists) {
                if (err) return next(err);
                var pilots = [];
                for(var i = 0; i < lists.length; i++) {
                    for(var j = 0; j < lists[i].ships.length; j++) {
                        pilots.push(lists[i].ships[j].pilot + ' - ' + lists[i].faction);
                    }
                }
                opencpu.rCall("/library/xwingjson/R/get_top10/json", {
                    source: pilots
                }, function (err, data) {
                    if (!err) {
                        res.send(data);
                    } else {
                        console.log("opencpu call failed.");
                        next(err);
                    }
                });
            })
        });
    });

listRouter.route('/get/lastwinner')
    .get(function(req, res, next) {
        Tournament.find({ finished: true }, function(err, tournament){
            if(err){
                console.log("Error leyendo los torneos");
                return next(err);
            }
            Inscription.find({ tournament: tournament[0]._id }, function(err, inscription) {
                if(err){
                    console.log("Error leyendo los torneos");
                    return next(err);
                }
                List.find({ inscription: inscription[0]._id }, function (err, list) {
                    if (err) return next(err);
                    res.json(list);
                })
            }).limit(1).sort({ strengthOfSchedule: -1, victoryPoints: -1, swissPosition: 1, topPosition: 1 });
        }).sort({ startDate: -1 });
    });

module.exports = listRouter;
