var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = new Schema({
    name: { required: true, type: String },
    city: { required: true, type: String, default: '' },
    address: { required: true, type: String, default: '' },
    startDate: { required: true, type: Date },
    endDate: { required: false, type: Date },
    description: { required: false, type: String, default: '' },
    maxPlayers: { required: true, type: Number, default: 4 },
    rounds: { required: true, type: Number, default: 4 },
    top: { required: false, type: Number, default: 0 },
    finished: { required: true, type: Boolean, default: false },
    organizer: { required: true, type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Tournaments', tournamentSchema);
