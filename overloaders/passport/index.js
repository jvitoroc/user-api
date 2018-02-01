const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/user');
const _ = require("lodash");
const passport = require("passport");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSECRET;
//opts.jsonWebTokenOptions = {expiresIn: 60000}

passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    if(jwt_payload.expiration_date < Date.now())
        return done(null, false)
    User.findOne({_id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;