var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inscriptionSchema = new Schema({
    player: { required: false, type: Schema.Types.ObjectId },
    tournament: { required: true, type: Schema.Types.ObjectId },
    name: { required: true, type: String },
    victoryPoints: { required: true, type: Number, default: 0 },
    strengthOfSchedule: { required: true, type: Number, default: 0 },
    swissPosition: { required: false, type: Number },
    topPosition: { required: false, type: Number },
    bracketPosition: { required: false, type: Number },
    firstRoundBye: { required: true, type: Boolean, default: false },
    drop: { required: true, type: Boolean, default: false }
});

module.exports = mongoose.model('Inscriptions', inscriptionSchema);
