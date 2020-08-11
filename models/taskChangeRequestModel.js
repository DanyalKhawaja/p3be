var mongoose = require("mongoose");
var schema = mongoose.Schema;

var taskChangeRequestSchema = new schema(
  {
    task: { type: Number,ref: 'Task', required:true},
    project: {  type: mongoose.Schema.ObjectId, ref: 'Project',  required: true},
    parentTask: {  type: Number, ref: 'Task' },
    description: { type: String, required: true },
    changedStartDate: { type: Date, required: true  },
    changedEndDate: { type: Date, required: true  },
    workPackage: { type: Boolean,  required: true},
    changedCost: { type: Number,  required: true },
    deleted: { type: Boolean,  default: false },
    milestone: { type: Boolean, required: true },
    changeRequestedOn: { type: Date },
    changeRequestedBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true },
    updatedDate: { type: Date },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reasonForChange : { type: String, required: true },
    assignedTo : { type: mongoose.Schema.ObjectId, ref: 'User' },
    status : { type: String,  enum: ['Approved','Rejected','Inreview'], required: true }
 
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("TaskChangeRequest", taskChangeRequestSchema);

