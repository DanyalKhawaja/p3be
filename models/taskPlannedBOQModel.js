var mongoose = require("mongoose");
var schema = mongoose.Schema;
var TaskPlannedResourceBaseModel = require("./taskPlannedResourceBaseModel");

var taskPlannedBOQSchema = new schema({

   boqType: {
      type: String,
      required: true
   },
   boq: {
      type: mongoose.Schema.ObjectId, ref: "BOQ", required: true
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

module.exports = TaskPlannedResourceBaseModel.discriminator("TaskPlannedBOQ", taskPlannedBOQSchema);
