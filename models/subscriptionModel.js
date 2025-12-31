const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subscriptionSchema = new schema({
    company: {
      type: mongoose.Schema.ObjectId,
      ref: 'company',
      required: true
   },
   validity: {
      type: Date
   },
   type: {
      type: String,   
      required: true
   },
   createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "subscription"
   },
   createDate: { 
      type: Date, 
      default: Date.now 
   },

});
;
module.exports = mongoose.model("subscription", subscriptionSchema);


