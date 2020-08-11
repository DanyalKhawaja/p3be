var mongoose = require("mongoose");
var schema = mongoose.Schema;

var departmentSchema = new schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, unique: true },
    HOD: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
      },
  }
);

module.exports = mongoose.model("Department", departmentSchema);
