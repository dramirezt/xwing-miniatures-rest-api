var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    // Main data
    username: { required: true, type: String, unique: true },
    registerDate: { required: true, type: Date },
    city: { required: false, type: String },
    country: { required: false, type: String },
    picture: { requried: false, type: String },

    // Security
    organizer: {
        type: Boolean,
        default: false
    },
    admin:   {
        type: Boolean,
        default: false
    },
    hashedPassword: { required: true, type: String },
    salt: { required: true, type: String },

    // Competitive profile
    games: { required: true, type: Number, default: 0 },
    victories: { required: true, type: Number, default: 0 },
    defeats: { required: true, type: Number, default: 0 },
    empireGames: { required: true, type: Number, default: 0 },
    rebelGames: { required: true, type: Number, default: 0 },
    scumGames: { required: true, type: Number, default: 0 },
});

userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

userSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function() { return this._plainPassword; });


userSchema.methods.comparePassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', userSchema);
