var mongoose = require("mongoose");
var schema = mongoose.Schema;
var TaskPlannedResourceBaseModel = require("./taskPlannedResourceBaseModel");

var taskPlannedResourceSchema = new schema({
   resource: {
      type: mongoose.Schema.ObjectId,
      ref: "Resource",
      required: true
   },
   resourceType: {
      type: mongoose.Schema.ObjectId,
      ref: "ResourceType",
      required: true
   },
   external: {
     type: Boolean,
     default: false
   },
   plannedStartDate: {
      type: Date,
      required: true
   },
   plannedEndDate: {
      type: Date,
      required: true
   },
   projectLocation: {
      type: mongoose.Schema.ObjectId,
      ref: "ProjectLocation",
      // required: true
   }
});

module.exports = TaskPlannedResourceBaseModel.discriminator("TaskPlannedResource", taskPlannedResourceSchema);
