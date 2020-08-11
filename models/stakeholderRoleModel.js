var mongoose = require("mongoose");
var schema = mongoose.Schema;

var stakeholderRoleSchema = new schema(
  {
    description : { type: String, required: true }
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("StakeholderRole", stakeholderRoleSchema);

