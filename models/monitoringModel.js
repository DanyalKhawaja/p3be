var { Schema, model, Schema: { ObjectId } } = require("mongoose");

var monitoringSchema = new Schema(
  {
    project: {
      type: ObjectId, ref: 'Project', required: true
    },
    // task: {
    //   type: ObjectId, ref: 'Task', required: true

    // },
    taskId: {
      type: String, required: true

    },
    monitoringDate: {
      type: Date, default: Date.now
    },
    actualCost: {
      type: Number, required: true
    },
    completion: {
      type: Number, required: true
    },
    
    createdDate: {
      type: Date, default: Date.now
    },
    createdBy: {
      type: ObjectId, ref: 'User', required: true
    }
  }
);

module.exports = model("Monitoring", monitoringSchema);
