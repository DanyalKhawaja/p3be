const mongoose = require("mongoose");

const schema = mongoose.Schema;

const companySchema = new schema({
   email: {
      type: String,
      unique: true
   },
   name: {
      type: String,
      unique: true,
      required: true
   },
   address: {
      type: String
   },
   phoneNo: {
      type: String
   },
   createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "company"
   },
   createDate: {
      type: Date,
     default: Date.now()
   },
    deleted: {
      type: Boolean,
      default: false
   }

});

module.exports = mongoose.model("company", companySchema);
