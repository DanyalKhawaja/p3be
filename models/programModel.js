var mongoose = require("mongoose");
var schema = mongoose.Schema;

var programSchema = new schema(
  {
    portfolio: {
      type: mongoose.Schema.ObjectId,
      ref: 'Portfolio'
    },
    name: { type: String, unique: true, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    periodFrom: { type: String, required: true },
    periodTo: { type: String, required: true },
    status: { type: String, required: true },
    budgetRequired: {type: String, required:true},
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    sponsor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    locked: {type: Boolean, default: false},
    lockedOn: {type: Date},
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdDate: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updateDate: { type: Date }

  }
);

module.exports = mongoose.model("Program", programSchema);
