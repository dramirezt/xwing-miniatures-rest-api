var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var upgradeSchema = new Schema({
  // type: { required: true, type: String },
  // name: { required: true, type: String },
  // description: { required: false, type: String },
  // points: { required: true, type: Number, value: 0 },
  // unique: { required: false, type: Boolean },
  // limited: { required: false, type: Boolean },
  // faction: { required: false, type: Boolean }
    "image": { required: true, type: String },
    "text": { required: true, type: String },
    "name": { required: true, type: String },
    "xws": { required: true, type: String },
    "unique": { required: false, type: Boolean },
    "limited": { required: false, type: Boolean },
    "points": { required: false, type: Number },
    "slot": { required: false, type: String },
    "faction": { required: false, type: String },
    "grants": [ { type: { required: false, type: String }, name: { required: false, type: String } }],
    "size": [ { required: false, type: String } ],

});

module.exports = mongoose.model('Upgrades', upgradeSchema);
