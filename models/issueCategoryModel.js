var mongoose = require("mongoose");
var schema = mongoose.Schema;

var issueCategorySchema = new schema(
  {

    description: { type: String,  required: true },
  }
);

module.exports = mongoose.model("IssueCategory", issueCategorySchema);
