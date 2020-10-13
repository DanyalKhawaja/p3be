var mongoose = require("mongoose");
var schema = mongoose.Schema;
var TaskPlannedResourceBaseModel = require("./taskPlannedResourceBaseModel");

var taskPlannedExternalResourceSchema = new schema({
  resourceType: {
    type: mongoose.Schema.ObjectId,
    ref: "ResourceType"
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  resourceCostPerUnit: {
    type: Number,
    required: true
  }
});

module.exports = TaskPlannedResourceBaseModel.discriminator("TaskPlannedExternalResource", taskPlannedExternalResourceSchema);
