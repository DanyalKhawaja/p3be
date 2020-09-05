var mongoose = require("mongoose");
var schema = mongoose.Schema;

var programBenefitMonitoringSchema = new schema(
  {
    benefit: { type: mongoose.Schema.ObjectId, ref: 'ProgramBenefit', required:true},
    benefitFrom : {type: Date,  required: true },
    benefitDuration: { type: String, required: true },
    benefitValue: { type: String, required: true },    
    explanation: { type: String, required: true },
    assessmentBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true },    
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true },
    createdDate: { type: Date, default: Date.now }
 
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ProgramBenefitMonitoring", programBenefitMonitoringSchema);

