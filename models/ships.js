var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shipSchema = new Schema({
    name: { required: true, type: String },
    keyname: { required: false, type: String },
    description: { required: false, type: String, default: '' },
    attack: { required: true, type: Number },
    agility: { required: true, type: Number },
    hull: { required: true, type: Number },
    shield: { required: true, type: Number },
    faction: { required: true, type: Schema.Types.ObjectId },
    actionBar: {
        barrelRoll: { required: true, type: Boolean, default: true },
        boost: { required: true, type: Boolean, default: false },
        cloak: { required: true, type: Boolean, default: false },
        evade: { required: true, type: Boolean, default: false },
        focus: { required: true, type: Boolean, default: false },
        slam: { required: true, type: Boolean, default: false },
        targetLock: { required: true, type: Boolean, default: false }
    },
    upgradeSlots: {
        astromech: { required: true, type: Number, default: 0 },
        bomb: { required: true, type: Number, default: 0 },
        cannon: { required: true, type: Number, default: 0 },
        crew: { required: true, type: Number, default: 0 },
        illicit: { required: true, type: Number, default: 0 },
        missile: { required: true, type: Number, default: 0 },
        modification: { required: true, type: Number, default: 1 },
        salvagedAstromech: { required: true, type: Number, default: 0 },
        system: { required: true, type: Number, default: 0 },
        tech: { required: true, type: Number, default: 0 },
        title: { required: true, type: Number, default: 0 },
        torpedo: { required: true, type: Number, default: 0 },
        turret: { required: true, type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Ships', shipSchema);
