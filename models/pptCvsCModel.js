var mongoose = require("mongoose");
var schema = mongoose.Schema;

var pptCvsCSchema = new schema(
  {
    pptId: {
      type: mongoose.Schema.ObjectId,
      ref: 'PPT',
      required: true
    },
    criteriaId1: {
        type: mongoose.Schema.ObjectId,
        ref: 'PPTCriteria',
        required: true
      },
      criteriaId2: {
        type: mongoose.Schema.ObjectId,
        ref: 'PPTCriteria',
        required: true
      },
      rowNo: {
        type: Number,
        required: true
    },
    columnNo: {
        type: Number,
        required: true
    },
    criteriaWeight: {
        type: Number,
        required: true
    },
      createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
  }
);

module.exports = mongoose.model("PPTCvsC", pptCvsCSchema);