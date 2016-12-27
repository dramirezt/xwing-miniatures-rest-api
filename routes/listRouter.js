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
  console.log(req.body);
  console.log(req.body.ships)
  var list = new List(req.body);
  console.log('L1: ' + list);
  List.create(list, function (err, list) {
    console.log('L2: ' + list);
    if (err) return next(err);
    list.save(function(err, resp){
      if(err) return next(err);
      console.log("List with id " + list._id + "created.");
      res.status(200).send('Your list has been created');
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

module.exports = listRouter;
