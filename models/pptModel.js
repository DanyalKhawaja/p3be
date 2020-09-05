var mongoose = require("mongoose");
var schema = mongoose.Schema;

var pptSchema = new schema(
  {
    name: { type: String, required:true},
    description: { type: String},
    portfolioId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Portfolio',
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

module.exports = mongoose.model("PPT", pptSchema);