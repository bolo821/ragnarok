const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/User');
const { jwtSecret } = require("../config/default.json");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        try {
            User.findOne({ account_id: jwt_payload.account_id }, async (err, user) => {
                if (!user) {
                    return done(null, false);
                } else {
                    return done(null, true);
                }
            });
        } catch (err) {
            console.log('error: ', err);
            return done(null, false);
        }
    })
  );
};