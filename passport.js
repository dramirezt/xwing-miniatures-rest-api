var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    User = require('./models/users');
    config = require('./config')

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secretKey;
  // opts.passReqToCallback = true;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          done(null, user);
      } else {
          done(null, false);
          // or you could create a new account
      }
    });
  }));
};
