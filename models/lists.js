var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
    inscription: { required: true, type: Schema.Types.ObjectId },
    faction: { required: false, type: String },
    ships: [{
      pilot: { required: true, type: String },
      ship: { required: false, type: String },
      upgrades: [{
        name: { required: false, type: String }
      }]
    }]
});

module.exports = mongoose.model('Lists', listSchema);
