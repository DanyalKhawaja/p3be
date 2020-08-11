var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueStatusSchema = new schema(
  {

    description: { type: String,  required: true },
  }
);

module.exports = mongoose.model("IssueStatus", issueStatusSchema);
