const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config/config");

const schema = mongoose.Schema;

const userSchema = new schema({
   email: {
      type: String,
      unique: true,
      required: true
   },
   username: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: true
   },
   department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department"
   },
   role: {
      type: String,
      required: true,
      ref: "Role"
   },
   lineManager: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   },
   createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   },
   updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   },
   createdDate: {
      type: Date,
      default: Date.now
   },
   updatedDate: {
      type: Date
   },
   isVerified: {
      type: Boolean,
      default: false
   },
   status: {
      type: String
   },
   deleted: {
      type: Boolean,
      default: false
   }
});
userSchema.methods.validPassword = function (password, callback) {
   var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
   callback(null, this.password === hash);
   // return this.password === hash;
};
userSchema.methods.comparePassword = function (candidatePassword, hash, callback) {
   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err)
         callback(err, null);
      callback(null, isMatch);
   });
};
userSchema.methods.setPassword = function (newUser, callback) {
   // this.salt = crypto.randomBytes(16).toString('hex');
   // this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
         newUser.password = hash;
         if (err)
            callback(err, null);
         callback(null, newUser);
      });
   });
};
userSchema.methods.generateJwt = function (user) {
   return jwt.sign(user.toJSON(), config.token.secret, {
      expiresIn: config.token.expiresIn
   });
};
module.exports = mongoose.model("User", userSchema);
