var mongoose = require("mongoose");
var schema = mongoose.Schema;
var costBreakup = new schema({
  resourceHours: { type: Number },
  laborHours: { type: Number },
  laborCost: { type: Number },
  contractorEquipmentHours: { type: Number },
  consumableMaterialCost: { type: Number }
});
var TaskSchema = new schema({
  taskId: { type: String, required: true },
  project: { type: mongoose.Schema.ObjectId, ref: "Project", required: true },
  parentTask: { type: String, ref: "Task" },
  description: { type: String, required: true },
  plannedStartDate: { type: Date, required: true },
  plannedEndDate: { type: Date, required: true },
  actualStartDate: { type: Date },
  actualEndDate: { type: Date },
  completed: { type: Number, default: 0 },
  monitoringFrequency: { type: String },
  workPackage: { type: Boolean },
  costBreakup: { type: costBreakup },
  plannedCost: { type: Number, required: true },
  deleted: { type: Boolean },
  milestone: { type: Boolean },
  criticalPath: { type: Boolean },
  projectLocation: { type: mongoose.Schema.ObjectId, ref: "ProjectLocation" },
  createDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
});

//TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("Task", TaskSchema);
