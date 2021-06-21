var mongoose = require("mongoose");
var schema = mongoose.Schema;

var boqSchema = new schema(
  {
    name: { type: String,  required: true },
    type: { type: String, required: true, default: "4" },

  }
);

module.exports = mongoose.model("boq", boqSchema);
