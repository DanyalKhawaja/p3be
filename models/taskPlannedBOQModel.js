var mongoose = require("mongoose");
var schema = mongoose.Schema;
var TaskPlannedResourceBaseModel = require("./taskPlannedResourceBaseModel");

var taskPlannedBOQSchema = new schema({
   item: {
      type: String
   },
   itemType: {
      type: String
   },
   quantity: {
      type: Number,
      required: true
   },
   resourceCostPerUnit: {
      type: Number,
      required: true
   },
   UOM: {
      type: String
   }
});

module.exports = TaskPlannedResourceBaseModel.discriminator("TaskPlannedBOQ", taskPlannedBOQSchema);
