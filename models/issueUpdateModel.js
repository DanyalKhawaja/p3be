var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueUpdateSchema = new schema(
  {
    issue: { 
        type: mongoose.Schema.ObjectId,
        ref: 'IssueInitiationLog', 
        required: true
    },
    issueUpdateDate: { type: String, required: true },
    comment: { type: String, required: true },
    responsible: {  type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true },

  }
);

module.exports = mongoose.model("IssueUpdate", issueUpdateSchema);

