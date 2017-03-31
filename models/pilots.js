var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pilotSchema = new Schema({
    "name": { required: true, type: String },
    "ship": { required: true, type: String },
    "skill": { required: false, type: Number },
    "points": { required: false, type: Number },
    "unique": { required: false, type: Boolean },
    "slots": [ { required: false, type: String } ],
    "text": { required: false, type: String },
    "image": { required: false, type: String },
    "faction": { required: true, type: String },
    "xws": { required: true, type: String }
});

module.exports = mongoose.model('Pilots', pilotSchema);
