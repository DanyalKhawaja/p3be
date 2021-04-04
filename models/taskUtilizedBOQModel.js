var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TaskUtilizedResourceBaseModel = require('./taskUtilizedResourceBaseModel.js');

var taskUtilizedBOQSchema = new Schema({

  boqType: {
    type: String,
    // required: true
  },
  top3: {
    type: Number,
    default: 0
 },
  uom: {
    type: String,
    // required: true
  }
});

module.exports = TaskUtilizedResourceBaseModel.discriminator("TaskUtilizedBOQ", taskUtilizedBOQSchema);

