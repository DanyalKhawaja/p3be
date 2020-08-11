var mongoose = require("mongoose");
var schema = mongoose.Schema;

var portfolioSchema = new schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  // startDate: { type: Date, required: true },
  // endDate: { type: Date, required: true },
  budgetRequiredTotal: { type: String, required: true },
  periodFrom: { type: String, required: true },
  periodTo: { type: String, required: true },
  manager: { type: mongoose.Schema.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
