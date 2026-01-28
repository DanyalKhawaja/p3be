var mongoose = require("mongoose");
var schema = mongoose.Schema;

var programSchema = new schema(
    {
        portfolio: {
            type: mongoose.Schema.ObjectId,
            ref: 'Portfolio',
            default: null
        },
        name: { type: String, unique: true, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String , default: "Approved"},
        currency: {
           type: String,
            ref: "Currency",
            default: "usd"
        },
        budgetRequired: { type: Number, default: 0},
        totalEstimatedBudget: {type: Number, default: 0},
        manager: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        sponsor: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        // locked: {type: Boolean, default: false},
        // lockedOn: {type: Date},
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        createdDate: { type: Date, default: Date.now },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        updateOn: { type: Date }

    }
);

module.exports = mongoose.model("Program", programSchema);
