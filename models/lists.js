var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
    inscription: { required: true, type: Schema.Types.ObjectId },
    // ships: [{
    //   pilot: { required: true, type: Schema.Types.ObjectId },
    //   upgrades: [{
    //     upgrade: { required: false, type: Schema.Types.ObjectId }
    //   }]
    // }]
    ships: [{
      pilot: { required: true, type: String },
      upgrades: [{
        name: { required: false, type: String }
      }]
    }]
});

module.exports = mongoose.model('Lists', listSchema);
