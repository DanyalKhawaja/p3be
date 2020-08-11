var mongoose = require("mongoose");
var schema = mongoose.Schema;

var procurementSchema = new schema({

  project: { type: mongoose.Schema.ObjectId, ref: 'Project', required: true },
  seller: { type: String, required: true },
  sow: { type: String, required: true },
  price: { type: Number, required: true },
  deliverable: { type: String, required: true },
  contactName: { type: String },
  contactPhone: { type: String },
  completion: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  status: { type: String, required: true }
});

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("Procurement", procurementSchema);

