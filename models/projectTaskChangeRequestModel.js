var mongoose = require("mongoose");
var schema = mongoose.Schema;

var projectTaskChangeRequestSchema = new Schema(
  {
    
    task: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',required:true
      },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',required:true
      },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',required:true
      },
    description: { type: String, required: true } ,
      resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',required:true
      },
    changedStartDate: { type: Date, default: Date.now  },
    changedEndDate: { type: Date, default: Date.now  },
    workPackage :{ type: String, required: true } ,
    changedCost:{ type: Number, required: true } ,
    deleted:{ type: Boolean, required: true } ,
    milestone:{ type: Boolean, required: true } ,
    changeRequestedOn: { type: Date, default: Date.now  },
    changeRequestedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',required:true
      },
    updatedDate: { type: Date, default: Date.now  },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
    reasonForChange:{ type: String, required: true } ,
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',required:true
      },
    status:{ type: String, required: true }    
}
);

module.exports = mongoose.model("ProjectTaskChangeRequestSchema", projectTaskChangeRequestSchema);
  