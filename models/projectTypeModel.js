var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectTypeSchema = new Schema(
  {

    description: { type: String, unique: true, required: true },
  }
);

module.exports = mongoose.model("ProjectType", ProjectTypeSchema);
