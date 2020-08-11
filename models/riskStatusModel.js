var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RiskStatusSchema = new Schema(
  {
    description: { type: String, unique: true, required: true }

  }
);

module.exports = mongoose.model("RiskStatus", RiskStatusSchema);
