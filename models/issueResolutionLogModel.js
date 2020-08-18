var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueResolutionLogSchema = new schema(
  {
    issue: {
      type: mongoose.Schema.ObjectId,
      ref: 'IssueInitiationLog',
      required: true
    },
    responsibleForResolution: { type: String, required: true },
    issueType: {
      type: mongoose.Schema.ObjectId,
      ref: 'IssueType',
      required: true
    },
    priority: { type: Number, required: true, min: 0, max: 5 },
    status: { type: String, required: true },
    deliveryEstimate: { type: Date, required: true },
    createdDate: { type: String, default: Date.now() },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  }
);

module.exports = mongoose.model("IssueResolutionLog", issueResolutionLogSchema);

