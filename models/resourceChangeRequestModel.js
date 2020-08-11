var mongoose = require("mongoose");
var schema = mongoose.Schema;

var resourceChangeRequestSchema = new schema(
  {
    taskChangeRequest: { type: mongoose.Schema.ObjectId, ref: 'TaskChangeRequest', required: true },
    taskPlannedResource: { type: Number, ref: 'TaskPlannedResource', required: true },
    project: { type: mongoose.Schema.ObjectId, ref: 'Project', required: true },
    task: { type: Number, ref: 'Task', required: true },
    resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', required: true },
    quantity: { type: Number, required: true },
    costPerUnit: { type: Number, required: true }


  }
);

module.exports = mongoose.model("ResourceChangeRequestSchema", resourceChangeRequestSchema);
  
