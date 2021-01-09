var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueLogSchema = new schema({
   project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true
   },
   description: {
      type: String,
      required: true
   },
   logs: [{
      category: {
         type: mongoose.Schema.ObjectId,
         ref: "IssueCategory",
         required: true
      },
      logDate: {
         type: Date,
         required: true
      },
      requestedBy: {
         type: String,
         required: true
      },
      issueType: {
         type: mongoose.Schema.ObjectId,
         ref: "IssueType",
         required: true
      },
      urgency: {
         type: Number,
         required: true,
         min: 0,
         max: 5
      },
      responsibleForResolution: {
         type: String
      },
      comments: {
        type: String,
      },
      status: {
         type: String,
         required: true
      },
      deliveryEstimate: {
         type: Date
      },
      createdDate: {
         type: String,
         default: Date.now
      },
      createdBy: {
         type: mongoose.Schema.ObjectId,
         ref: "User",
         required: true
      }
   }]
});

module.exports = mongoose.model("IssueLog", issueLogSchema);
