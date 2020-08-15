var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceTypeSchema = new Schema(
  {
    name: { type: String,  required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    parentId: {
          type: mongoose.Schema.ObjectId,
          ref: 'ResourceType'
        },
    child: [{type: mongoose.Schema.ObjectId,
            ref: 'ResourceType', default: []
          }],
    level: {type: Number},
    path: { type: String },
    currency: { type: String},
    unit: { type: String},
    rate: {type: Number},
    singleItem : {type: Boolean},
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }, 
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }, 
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }        
  }
);

ResourceTypeSchema.post("save", function () {
  var rt= this;
});

ResourceTypeSchema.pre("save", function () {
  var rt= this;
});
module.exports = mongoose.model("ResourceType", ResourceTypeSchema);
