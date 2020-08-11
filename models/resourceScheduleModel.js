var mongoose = require("mongoose");
var schema = mongoose.Schema;

var resourceScheduleSchema = new Schema(
  {
    
  resource: {
    type: mongoose.Schema.ObjectId,
    ref: 'Resource',required:true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',required:true
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',required:true
  },
  engagedDate: { type: Date }
    
}
);

module.exports = mongoose.model("ResourceScheduleSchema", resourceScheduleSchema);
  
