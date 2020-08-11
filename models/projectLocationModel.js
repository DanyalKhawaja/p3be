var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectLocationSchema = new Schema(
  {
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'projects'
      },
    projectLocationName: { type: String },
    pathId: { type: Number },
    pathSeqNo: { type: Number },
    pathType: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  }
);

module.exports = mongoose.model("ProjectLocation", ProjectLocationSchema);
