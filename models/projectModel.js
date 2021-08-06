var mongoose = require("mongoose");
var schema = mongoose.Schema;
var projectSchema = new schema({
    name: {type: String, required: true},
    description: {type: String, default: null},
    projectType: {
        type: mongoose.Schema.ObjectId,
        ref: "ProjectType",
    },
    program: {
        type: mongoose.Schema.ObjectId,
        default: null,
        ref: "Program",
    },
    expectedStartDate: {type: Date},
    expectedEndDate: {type: Date},
    projectLocation: {
        type: Object,
    },
    completed: {
        type: Number
    },
    lastMonitoringDate: {
        type: Date
    },
    currency: {
        type: String,
        ref: "Currency",
    },
    totalEstimatedBudget: {type: Number, default: 0},
    managementReserve: {type: Number, default: 0},
    notes: {type: String, default: null},
    manager: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: [
            "OPEN",
            "PLANNED",
            "REVIEW",
            "REJECTED",
            "APPROVED",
            "STOPPED",
            "UNDERGOING",
        ],
        default: "OPEN",
    },
    graphLabels: {
        type: Array,
        default: [],
    },
    milestone: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date},
});

module.exports = mongoose.model("Project", projectSchema);
