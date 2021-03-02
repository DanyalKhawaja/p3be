var mongoose = require("mongoose");
var schema = mongoose.Schema;

var programBenefitSchema = new schema(
  {
     
    program: { type: mongoose.Schema.ObjectId, ref: 'Program', required:true},
    nature: { type: mongoose.Schema.ObjectId, ref: 'BenefitsNature',  required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    measurementApproach: { type: String, required: true },
    notes: { type: String, required: true },
    benefitStartDate: { type: Date },
    benefitDuration: { type: Number, required: true },
    assessmentResponsibility: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User',  required: true }
 
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("ProgramBenefit", programBenefitSchema);

