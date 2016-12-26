var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
    inscription: { required: false, type: Schema.Types.ObjectId },
    ships: [{
      pilot: { required: true, type: Schema.Types.ObjectId },
      upgrades: [{
        upgrade: { required: false, type: Schema.Types.ObjectId }
      }]
    }]
});

module.exports = mongoose.model('Lists', listSchema);
