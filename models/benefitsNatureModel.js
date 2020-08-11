var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BenefitsNatureSchema = new Schema(
  {
    description: { type: String, unique: true, required: true }

  }
);

module.exports = mongoose.model("BenefitsNature", BenefitsNatureSchema);
