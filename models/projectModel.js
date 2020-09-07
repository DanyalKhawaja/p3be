var mongoose = require("mongoose");
var schema = mongoose.Schema;
var milestone = require("./componentMilestoneModel").schema;
var projectSchema = new schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    projectType: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProjectType'
    },
    program: { type: mongoose.Schema.ObjectId, ref: 'Program', required: true },
    expectedStartDate: { type: Date },
    expectedEndDate: { type: Date },
    milestones: [milestone],
    projectLocation: {
      type: Object
    },
    totalEstimatedBudget: { type: String },
    managementReserve: { type: Number, default: 0 },
    notes: { type: String },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },

  }
);

module.exports = mongoose.model("Project", projectSchema);
