var mongoose = require("mongoose");
var schema = mongoose.Schema;

var portfolioSchema = new schema({
  name: { type: String, required: true },
  description: { type: String },
  manager: {type:mongoose.Schema.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  totalEstimatedBudget: {type: Number, default: 0},
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
