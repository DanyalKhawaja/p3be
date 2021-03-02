var mongoose = require("mongoose");
var schema = mongoose.Schema;

var stakeholderRoleSchema = new schema(
  {
    name: { type: String, required: true },
    description : { type: String }
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("StakeholderRole", stakeholderRoleSchema);

