var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskUtilizedResourceBaseSchema = new Schema({
  tpr: {
    type: mongoose.Schema.ObjectId, ref: 'TaskPlannedResource', required: true
  },
  project: {
    type: mongoose.Schema.ObjectId, ref: 'Project', required: true
  },
  task: { type: mongoose.Schema.ObjectId, ref: 'Task', required: true },
  wp: { type: String, required: true },
  monitoring: { type: mongoose.Schema.ObjectId, ref: 'Monitoring', required: true },
  quantity: { type: Number, required: true },
  actualCostPerUnit: { type: Number, required: true },
  description: { type: String },
  monitoringDate: { type: Date, default: Date.now() }
  // taskPlannedResource: {type: mongoose.Schema.ObjectId, ref: 'TaskPlannedResource'}
},
  {
    discriminatorKey: "__type",
    collection: 'taskResourcesUtilized'
  }
);

module.exports = mongoose.model("TaskUtilizedResourceBase", taskUtilizedResourceBaseSchema);

