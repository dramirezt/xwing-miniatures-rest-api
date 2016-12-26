var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var List = require('../models/lists');
var Inscription = require('../models/inscriptions');

var listRouter = express.Router();

listRouter.route('/')
.get(function (req, res, next){
  List.find({ id: req.params.inscriptionId }, function(err, list) {
    if (err) return next(err);
    res.contentType('application/json');
    res.json(list.ships);
  })
})

.post(function (req, res, next) {
  List.create(req.body, function (err, list) {
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
