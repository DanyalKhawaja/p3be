var mongoose = require("mongoose");
var schema = mongoose.Schema;
var milestone = require("./componentMilestoneModel").schema;
var projectSchema = new schema({
  name: { type: String, required: true },
  description: { type: String },
  projectType: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProjectType'
  },
  program: {
    type: mongoose.Schema.ObjectId, 
    default: null,
    ref: 'Program',
  },
  expectedStartDate: { type: Date },
  expectedEndDate: { type: Date },
  milestones: [milestone],
  projectLocation: {
    type: Object
  },

  currency: {
    type: String, ref: 'Currency'
  },
  totalEstimatedBudget: { type: String },
  managementReserve: { type: Number, default: 0 },
  notes: { type: String },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['OPEN', 'PLANNED', 'REVIEW', 'REJECTED', 'APPROVED', 'STOPPED', 'UNDERGOING'],
    default: 'OPEN'
  },
  graphLabels: {
    type: Array,
    default: []
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
