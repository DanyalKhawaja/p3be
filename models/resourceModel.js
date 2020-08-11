var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSchema = new Schema(
  {

    resourceType: {
          type: mongoose.Schema.ObjectId,
          ref: 'ResourceType',
         required:true
        },
    resourceName: { type: String, required:true},
    resourceUnit: { type: String, required:true},
    calendarType: { type: Boolean, required:true},
    available  : { type: Boolean, required:true}

    
  }
);

module.exports = mongoose.model("Resource", ResourceSchema);
