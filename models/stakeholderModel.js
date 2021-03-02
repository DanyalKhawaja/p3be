var mongoose = require("mongoose");
var schema = mongoose.Schema;

var stakeholderSchema = new schema({    
    project: { type: mongoose.Schema.ObjectId, ref: 'Project', required:true},
    role: {  type: mongoose.Schema.ObjectId, ref: 'StakeholderRole',  required: true},
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    levelSupportRequired: { type: Number, required: true, min:1, max:20 },
    levelSupportProvided: {type: Number, required: true, min:-20, max:20 },
    impact: { type: Number, required: true, min:1, max:20},
    // riskRating: { type: Number, required: true, min:1,max:2},
    riskRating: { type: Number, required: true},
    issues: { type: String, required: true },
    feedback: { type: String, required: true },
    influenceStrategy: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true }
  });

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("Stakeholder", stakeholderSchema);
