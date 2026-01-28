var mongoose = require("mongoose");
var schema = mongoose.Schema;

var departmentSchema = new schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    HOD: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
  }
);

module.exports = mongoose.model("Department", departmentSchema);
