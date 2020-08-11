const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')

const userModel = require('../models/userModel');
const config = require('../config/config');

// module.exports = function (passport) {
   let opts = {};
   //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
   // console.log(ExtractJwt.fromAuthHeaderAsBearerToken())
   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
   opts.secretOrKey = config.token.secret;
   // opts.issuer = 'mobi.vxt.net';
   // opts.audience = 'vxt.net';
   // console.log(opts)
   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log('--auth', jwt_payload)
      userModel.findOne({_id:jwt_payload._id}, (err, user) => {
         // console.log('find user')
         // console.log(user)
         // console.log(err)
         if (err) return done({success:false,message:"Please provide authorization token",err:err}, false);
         if (user) {
            // console.log('found user')
            return done(null, user);
         } else {
            return done(null, false);
         }
      });
   }));
// }