var mongoose = require("mongoose");
var schema = mongoose.Schema;

var pptCriteriaSchema = new schema(
  {
    name: { type: String, required:true, unique: true},
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdDate: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("PPTCriteria", pptCriteriaSchema);