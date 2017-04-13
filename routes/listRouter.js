var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var List = require('../models/lists');
var Inscription = require('../models/inscriptions');

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

listRouter.route('/pilotuse')
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
        // List.find(function(err, lists) {
        //     if (err) return next(err);
        //     var pilots = [];
        //     for(var i = 0; i < lists.length; i++) {
        //         for(var j = 0; j < lists[i].ships.length; j++) {
        //             pilots.push(lists[i].ships[j].pilot);
        //         }
        //     }
        //     opencpu.rCall("/library/xwingjson/R/get_pilot_use/json", {
        //         source: res.json(lists)
        //     }, function (err, data) {
        //         if (!err) {
        //             res.send(data);
        //         } else {
        //             console.log("opencpu call failed.");
        //             next(err);
        //         }
        //     });
        // })
    });

module.exports = listRouter;
