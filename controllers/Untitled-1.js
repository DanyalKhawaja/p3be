
  let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate([{
    $match: {project: { $in: projects } ,
        { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }
      ]
    }
  }, {
    $group: {
      _id: "$project",
      total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
    }
  }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});


  let actualLaborBreakup = (await taskUtilizedResourceModel.aggregate([
    {
      $match: {
        $and: [{ project: { $in: projects } }, { boqType: '1' }]
      }
    },
    {
      $group: {
        _id: "$project",
        total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});
  let actualContractorEquipmentBreakup = (await taskUtilizedResourceModel.aggregate([
    {
      $match: {
        $and: [{ project: { $in: projects } }, { boqType: '3' }]
      }
    },
    {
      $group: {
        _id: "$project",
        total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});





  //--------------------------------------------------------------
  let plannedResourceBreakup = (await taskPlannedResourceModel.aggregate([
    {
      $match: {
        $and: [
          { project: { $in: projects } },
          { $or: [{ boqType: '1' }, { __type: 'TaskPlannedResource' }] }
        ]
      }
    },
    {
      $group: {
        _id: "$project",
        total: { $sum: { $multiply: ['$cost', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});
 
  let plannedLaborBreakup = (await taskPlannedResourceModel.aggregate([
    {
      $match: {
        $and: [{ project: { $in: projects } }, { boqType: '1' }]
      }
    },
    {
      $group: {
        _id: "$project",
        total: { $sum: { $multiply: ['$cost', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});
  
  let plannedContractorEquipmentBreakup = (await taskPlannedResourceModel.aggregate([
    {
      $match: {
        $and: [{ project: { $in: projects } }, { boqType: '3' }]
      }
    },
    {
      $group: {
        _id: "$project",
        total: { $sum: { $multiply: ['$cost', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = row.total;
    return obj;
  }, {});
  let consumableMaterialBreakup = (await taskPlannedResourceModel.aggregate([
    {
      $match: {
        $and: [{ project: { $in: projects } }, { boqType: '4' }, { top3: { $ne: 0 } }]
      }
    },
    {
      $group: {
        _id: { material: '$description' },
        total: { $sum: { $multiply: ['$cost', '$quantity'] } }
      }
    }
  ])).reduce((obj, row) => {
    if (!obj[row._id.material]) obj[row._id.material] = {};
    obj[row._id.material] = row.total;
    return obj;
  }, {});
  let programCostAndCompletion = (await taskModel.aggregate([
    { $sort: { plannedStartDate: 1 } },
    { $match: { project: { $in: projects }, workPackage: true } },
    {
      $group: {
        _id: "$project",
        actual: { $sum: '$actualCost' },
        planned: { $sum: '$plannedCost' },
        completion: { $sum: { $multiply: ['$weightage', '$completed'] } }
      }
    }
  ])).reduce((obj, row) => {
    let prop = programMap[row._id.toString()];
    if (!obj[prop]) obj[prop] = {};
    obj[prop][row._id.toString()] = { actual: row.actual, planned: row.planned, completion: row.completion }
    return obj;
  }, {});

  let projectsSchedule = await projectModel.aggregate([{
    $match: { program: { $in: programs } },
  }, {
    $project: {
      plannedDays: { $divide: [{ $subtract: ["$expectedEndDate", "$expectedStartDate"] }, 864e5] },
      actualDays: {
        $divide: [{
          $subtract: [{
            $cond: { if: { $eq: ["$completed", 100] }, then: "$lastMonitoringDate", else: new Date() }
          }, "$expectedStartDate"]
        }, 864e5]
      },

    }
  }, {
    $group: {
      _id: "$_id",
      projectActualDays: { $sum: "$actualDays" },
      projectPlannedDays: { $sum: "$plannedDays" }
    }
  }
  ]);
