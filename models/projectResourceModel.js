var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectResourceSchema = new Schema(
  {
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
      },
    resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource'
      }
  }
);

module.exports = mongoose.model("ProjectResource", ProjectResourceSchema);
