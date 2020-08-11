var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResourceTypeSchema = new Schema(
  {

    description: { type: String },
    resourceSubTypeId: { type: String, required: true }
    // resourceSubTypeId: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'resourceSubTypes'
    //   },
  }
);

module.exports = mongoose.model("ResourceType", ResourceTypeSchema);
