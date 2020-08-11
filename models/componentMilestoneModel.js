var mongoose = require("mongoose");
var schema = mongoose.Schema;


var componentMilestoneSchema = new schema(  {    
 //   programComponent: { type: mongoose.Schema.ObjectId, ref: 'ProgramComponent', required:true},
    name: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true },

   });
// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ComponentMilestone", componentMilestoneSchema);

