var mongoose = require("mongoose");
var schema = mongoose.Schema;

const taskPlannedResourceBaseSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true
  },
  wp: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  discriminatorKey: "__type",
  collection: "taskPlannedResources"
});

module.exports = mongoose.model("TaskPlannedResourceBase", taskPlannedResourceBaseSchema);
