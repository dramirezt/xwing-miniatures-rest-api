var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = new Schema({
    name: { required: true, type: String },
    tier: { required: true, type: String, default: 'Casual' },
    city: { required: false, type: String, default: '' },
    address: { required: false, type: String, default: '' },
    startDate: { required: true, type: Date },
    endDate: { required: false, type: Date },
    description: { required: false, type: String, default: '' },
    maxPlayers: { required: true, type: Number, default: 4 },
    rounds: { required: false, type: Number, default: 4 },
    top: { required: false, type: Number, default: 0 },
    finished: { required: true, type: Boolean, default: false },
    organizer: { required: false, type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Tournaments', tournamentSchema);
