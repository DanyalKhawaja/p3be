var mongoose = require("mongoose");
var schema = mongoose.Schema;

var pptCriteriaSchema = new schema(
  {
    name: { type: String, required:true},
    pptId: {
      type: mongoose.Schema.ObjectId,
      ref: 'PPT',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
  }
);

module.exports = mongoose.model("PPTCriteria", pptCriteriaSchema);