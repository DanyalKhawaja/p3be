var mongoose = require("mongoose");
var schema = mongoose.Schema;

var componentSchema = new schema(
  {
    program: {
      type: mongoose.Schema.ObjectId,
      ref: 'Program',
      default: null
    },
    name: { type: String, unique: true, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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

module.exports = mongoose.model("Component", componentSchema);
