var mongoose = require("mongoose");
var schema = mongoose.Schema;

var procurementDeliverableSchema = new schema(
  {
    procurement: {  type: mongoose.Schema.ObjectId, ref: 'Procurement',  required: true},
    deliverable : { type: String, required: true },
    targetDate : { type: Date },
    status : { type: String, required: true }
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ProcurementDeliverable", procurementDeliverableSchema);

