var mongoose = require("mongoose");
var schema = mongoose.Schema;

var monitoringSchema = new schema(
  {
    project: { 
        type: mongoose.Schema.ObjectId, ref: 'Project', required: true
    },
    task: { 
      type: mongoose.Schema.ObjectId, ref: 'Task',  required: true
      
    },
    monitoringDate: { type: Date,  default: Date.now },
    actualCost: { type: Number, required: true },
    completion: { type: Number, required:true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true }
  }
);
  
module.exports = mongoose.model("Monitoring", monitoringSchema);
