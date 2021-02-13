db.getCollection('projects').aggregate([{
    $match: { _id: ObjectId("5fd73e989ce78d6f0837c8eb"), expectedStartDate: { $lte: new Date() } }
}, {
    $project: {

        plannedDaysa: { $divide: [{ $subtract: ["$expectedEndDate", "$expectedStartDate"] }, 864e5] },
        actualDaysa: {
            $divide: [{
                $subtract: [{
                    $cond: { if: { $eq: ["$completed", 100] }, then: "$lastMonitoringDate", else: new Date() }
                }, "$expectedStartDate"]
            }, 864e5]
        },

    }
}, {
    $project: {
        plannedWeeks: { $divide: ["$plannedDaysa", 7] },
        actualWeeks: { $divide: ["$actualDaysa", 7] },
    }
}, {
    $project: {
        plannedDays: { $substract: ["$plannedDaysa", "$plannedWeeks"] },
        actualDays: { $substract: ["$actualDaysa", "$actualWeeks"] }
    }
},

{
    $group: {
        _id: "$_id",
        actualDays2: { $sum: "$actualDays" },
        plannedDays2: { $sum: "$plannedDays" }
    }
}
])