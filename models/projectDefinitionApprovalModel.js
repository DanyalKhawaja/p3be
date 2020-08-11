var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectDefinitionApprovalSchema = new Schema(
    {
        workflowStage: { type: String },
        comments: { type: String },
        projectAssignedTo: {
            type: mongoose.Schema.ObjectId,
            ref: 'projectResources'
        },
        projectType: {
            type: mongoose.Schema.ObjectId,
            ref: 'projectType'
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        },
        createdDate: { type: Date, default: Date.now },
        updatedDate: { type: Date },

    }
);

module.exports = mongoose.model("ProjectDefinitionApproval", ProjectDefinitionApprovalSchema);
