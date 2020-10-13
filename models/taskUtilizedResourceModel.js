var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TaskUtilizedResourceBaseModel = require('./taskUtilizedResourceBaseModel.js');

var taskUtilizedResourceSchema = new Schema({
  resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', required: true },
});

module.exports = TaskUtilizedResourceBaseModel.discriminator("TaskUtilizedResource", taskUtilizedResourceSchema);

