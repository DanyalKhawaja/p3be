var mongoose = require("mongoose");
var schema = mongoose.Schema;
var TaskPlannedResourceBaseModel = require("./taskPlannedResourceBaseModel");

var taskPlannedBOQSchema = new schema({
  
   boqType: {
      type: String,
      required: true
   },
   uom: {
      type: String,
      required: true
   }
});

module.exports = TaskPlannedResourceBaseModel.discriminator("TaskPlannedBOQ", taskPlannedBOQSchema);
