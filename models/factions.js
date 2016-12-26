var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var factionSchema = new Schema({
    name: { required: true, type: String },
    description: { required: false, type: String, default: '' },
    keyname: { required: false, type: String, default: '' }
});

module.exports = mongoose.model('Factions', factionSchema);
