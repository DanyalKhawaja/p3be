var mongoose = require("mongoose");
var schema = mongoose.Schema;

var programStakeholderSchema = new schema({    
    program: { type: mongoose.Schema.ObjectId, ref: 'Program', required:true},
    role: {  type: mongoose.Schema.ObjectId, ref: 'StakeholderRole',  required: true},
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    levelSupportRequired: { type: Number, required: true, min:1, max:5 },
    levelSupportProvided: {type: Number, required: true, min:1, max:5 },
    impact: { type: Number, required: true, min:0, max:100},
    riskRating: { type: Number, required: true, min:1,max:2},
    issues: { type: String, required: true },
    feedback: { type: String, required: true },
    influenceStrategy: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true }
  });

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ProgramStakeholder", programStakeholderSchema);
