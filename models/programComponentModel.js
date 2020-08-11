var mongoose = require("mongoose");
var schema = mongoose.Schema;
var milestone = require("./componentMilestoneModel").schema;

var programComponentSchema = new schema(
  {    
    program: { type: mongoose.Schema.ObjectId, ref: 'Program', required:true},
    name: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    milestones: [milestone],
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    description: { type: String},
    projectType: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProjectType'
    },
    projectLocation: {      type: Array    },
    totalEstimatedBudget: { type: String},
    notes: { type: String },
   
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedDate: { type: Date },

  }
 
  
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ProgramComponent", programComponentSchema);

