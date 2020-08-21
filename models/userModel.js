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
   designation: {
      type: String,
      required: true
   },
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   middleName: {
      type: String,
      required: true
   },
   phoneNo: {
      type: String,
      required: true
   },
   companyId: {
      type: String,
      required: true
   },
   department: {
      type: mongoose.Schema.ObjectId,
      ref: "Department",
      required: true
   },
   role: {
      type: mongoose.Schema.ObjectId,
      ref: "Role",
      required: true
   },
   lineManager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
   }, //required true
   employmentType: {
      type: String,
      required: true
   },
   createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   },
   updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
   },
   joiningDate: {
      type: Date,
      required: true
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
      type: String,
      required: true
   },
   deleted: {
      type: Boolean,
      default: false
   }
});
userSchema.methods.validPassword = function(password, callback) {
   var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
   callback(null, this.password === hash);
   // return this.password === hash;
};
userSchema.methods.comparePassword = function(candidatePassword, hash, callback) {
   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err)
         callback(err, null);
      callback(null, isMatch);
   });
};
userSchema.methods.setPassword = function(newUser, callback) {
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
userSchema.methods.generateJwt = function(user) {
   return jwt.sign(user.toJSON(), config.token.secret, {
      expiresIn: config.token.expiresIn
   });
};
module.exports = mongoose.model("User", userSchema);
