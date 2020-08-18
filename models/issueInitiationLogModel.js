var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueInitiationLogSchema = new schema(
  {
    project: { 
        type: mongoose.Schema.ObjectId,
        ref: 'Project', 
        required: true
    },
    description: { type: String, required: true },
    category: { 
        type: mongoose.Schema.ObjectId,
        ref: 'IssueCategory',  
        required: true },
    issueCreateDate: { type: String, required: true },
    requestedBy: { type: String, required: true },
    issueType: {
        type: mongoose.Schema.ObjectId,
        ref: 'IssueType',  
        required: true },
    urgency: { type: Number, required: true, min:0, max:5 },
    createdDate: { type: String,  default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId,
      ref: 'User', 
      required: true}
  }
);

module.exports = mongoose.model("IssueInitiationLog", issueInitiationLogSchema);
