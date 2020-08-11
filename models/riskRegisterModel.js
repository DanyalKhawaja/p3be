var mongoose = require("mongoose");
var schema = mongoose.Schema;

var riskRegisterSchema = new schema({
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', required: true },
  description: { type: String, required: true },
  costImpact: { type: Number, required: true },
  timeImpact: { type: Number, required: true },
  riskAssessment: { type: String },
  riskScore: { type: Number, required: true },
  targetDate: { type: Date },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  status: { type: mongoose.Schema.ObjectId, ref: 'RiskStatus', required: true },
  createDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedDate: { type: Date },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("riskRegisterSchema", riskRegisterSchema);

