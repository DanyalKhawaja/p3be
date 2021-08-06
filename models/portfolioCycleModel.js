const { Schema, model } = require('mongoose');

const portfolioCycleSchema = new Schema({
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: "Portfolio"
    },
    budget: {
        type: Number
    },
    status: { 
        type: String,
        default: "Open"
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    programs: {
        type: [Schema.Types.ObjectId],
        ref: "Program"
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})



module.exports = model("PortfolioCycle", portfolioCycleSchema);