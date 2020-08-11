var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSubTypeSchema = new Schema(
  {

    resourceSubTypeDesc: { type: String }
  }
);

module.exports = mongoose.model("ResourceSubType", ResourceSubTypeSchema);
