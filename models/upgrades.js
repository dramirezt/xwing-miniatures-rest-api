var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var upgradeSchema = new Schema({
  type: { required: true, type: String },
  name: { required: true, type: String },
  description: { required: false, type: String },
  points: { required: true, type: Number, value: 0 },
  unique: { required: false, type: Boolean },
  limited: { required: false, type: Boolean },
  faction: { required: false, type: Boolean }
});

module.exports = mongoose.model('Upgrades', upgradeSchema);
