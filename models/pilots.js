var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pilotSchema = new Schema({
    name: { required: true, type: String },
    unique: { required: true, type: Boolean, default: false },
    pilotSkill: { required: true, type: Number, default: 1 },
    ability: { required: false, type: String, default: '' },
    faction: { required: true, type: Schema.Types.ObjectId, ref: 'Faction' },
    points: { required: true, type: Number, default: 12 },
    elitePilot: { required: false, type: Number, default: 1 },
    ship: { required: true, type: Schema.Types.ObjectId, ref: 'Ship'}
});

module.exports = mongoose.model('Pilots', pilotSchema);
