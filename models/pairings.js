var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pairingSchema = new Schema({
    tournament: { required: true, type: Schema.Types.ObjectId },
    round: { required: true, type: Number, default: 1 },
    table: { required: false, type: Number },
    player1: { required: true, type: Schema.Types.ObjectId },
    player2: { required: false, type: Schema.Types.ObjectId },
    p1Score: { required: true, type: Number, default: 0 },
    p2Score: { required: true, type: Number, default: 0 },
    winner: { required: false, type: Schema.Types.ObjectId },
    isBye: { required: true, type: Boolean, default: false }
});

module.exports = mongoose.model('Pairings', pairingSchema);
