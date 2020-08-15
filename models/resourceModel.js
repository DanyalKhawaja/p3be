var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceSchema = new Schema(
  {
    resourceType: {
          type: mongoose.Schema.ObjectId,
          ref: 'ResourceType',
         required:true
        },
    resourceCode: { type: String, required:true},
    resourceName: { type: String, required:true},
    resourceUnit: { type: String, required:true},
    currency: { type: String},
    rate: {type: Number},
    isActive : { type: Boolean, required:true}//,
    //available  : { type: Boolean, required:true}
   
  }
);

module.exports = mongoose.model("Resource", ResourceSchema);
