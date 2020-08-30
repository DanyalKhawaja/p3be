var mongoose = require("mongoose");
var schema = mongoose.Schema;

var pptOvsOSchema = new schema(
  {
    pptId: {
      type: mongoose.Schema.ObjectId,
      ref: 'PPT',
      required: true
    },
    criteriaId: {
        type: mongoose.Schema.ObjectId,
        ref: 'PPTCriteria',
        required: true
      },
      optionId1: {
        type: mongoose.Schema.ObjectId,
        ref: 'PPTOptions',
        required: true
      },
      optionId2: {
        type: mongoose.Schema.ObjectId,
        ref: 'PPTOptions'
      }   ,
      rowNo: {
        type: Number,
        required: true
    },
    columnNo: {
        type: Number,
        required: true
    },
    optionWeight: {
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

module.exports = mongoose.model("PPTOvsO", pptOvsOSchema);