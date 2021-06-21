var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoleSchema = new Schema(
  {
 
    _id: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String }
  }
);

module.exports = mongoose.model("Role", RoleSchema);
