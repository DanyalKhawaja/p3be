var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueTypeSchema = new schema(
  {

    description: { type: String,  required: true }
  }
);

module.exports = mongoose.model("IssueType", issueTypeSchema);
