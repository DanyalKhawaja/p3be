var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskResourceUtilizedSchema = new Schema({

  project: {
    type: mongoose.Schema.ObjectId, ref: 'Project', required: true
  },
  task: { type: Number, ref: 'Task', required: true },
  resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', required: true },
  monitoring: { type: mongoose.Schema.ObjectId, ref: 'Monitoring', required: true },
  quantity: { type: Number, required: true },
  actualCostPerUnit: { type: Number, required: true }
});

module.exports = mongoose.model("TaskResourceUtilized", taskResourceUtilizedSchema);

