monthlyLaborByProjectId2: async function (req, res) {
  const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
  try {
    var project = ObjectId(req.params.id);
    let currentProject = { project };

    let allWPTasks = await taskModel
      .find({ project, workPackage: true })
      .populate('projectLocation', 'pathId')
      .sort({ plannedStartDate: 1 })
      .lean();
    let lastPlannedDate = new Date(0);
    let weightageMap = allWPTasks.reduce((map, task) => {
      map[task.taskId] = task.weightage;
      if (lastPlannedDate < task.plannedEndDate) lastPlannedDate = new Date(task.plannedEndDate);
      return map;
    }, {});

    let monitoringsCost;


    let datewiseBreakup = createDates(new Date(allWPTasks[0].plannedStartDate), lastPlannedDate);


    allWPTasks.forEach(task => {
      let plannedStartDate = new Date(task.plannedStartDate.toLocaleDateString());
      let plannedEndDate = new Date(task.plannedEndDate.toLocaleDateString());
      let i = 0;
      while (datewiseBreakup[i] && datewiseBreakup[i].date <= plannedEndDate) {
        if (datewiseBreakup[i].date >= plannedStartDate) {
          if (isBusinessDay(datewiseBreakup[i].date)) {
            datewiseBreakup[i].plannedCost += task.plannedCostPerDay;
            datewiseBreakup[i].plannedCompletion += weightageMap[task.taskId] / task.days;
          }
        }
        i++;
      }
    });

    datewiseBreakup.forEach((breakup, i) => {
      datewiseBreakup[i].cumulativePlannedCost = (i == 0 ? 0 : datewiseBreakup[i - 1].cumulativePlannedCost) + breakup.plannedCost;
      datewiseBreakup[i].cumulativePlannedCompletion = (i == 0 ? 0 : datewiseBreakup[i - 1].cumulativePlannedCompletion) + breakup.plannedCompletion;
    })

    let query = [
      { $match: currentProject },
      {
        $group: {
          _id: '$monitoringDate',
          actualCost: { $sum: '$actualCost' },
          monitoringWeight: { $sum: '$monitoringWeight' },
        }
      },
      { $sort: { _id: 1 } }

    ];


    monitoringsCost = await monitoringModel.aggregate(query);

    let datewiseActualBreakup = monitoringsCost.map(m => ({ date: m._id, actualCost: 0, actualCompletion: 0, cumulativeActualCompletion: 0, cumulativeActualCost: 0 }));


    monitoringsCost.forEach((monitoring, i) => {
      datewiseActualBreakup[i].actualCost += monitoring.actualCost;
      datewiseActualBreakup[i].actualCompletion += monitoring.monitoringWeight;
      datewiseActualBreakup[i].cumulativeActualCost = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCost : 0) + datewiseActualBreakup[i].actualCost;
      datewiseActualBreakup[i].cumulativeActualCompletion = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCompletion : 0) + datewiseActualBreakup[i].actualCompletion;
    })

    let result = await (await taskPlannedResourceModel.find({ project }).populate("task", ["plannedStartDate", "plannedEndDate"]).lean()).filter(row => row.task.plannedEndDate <= new Date());
    let monthlyLabor = {};
    result.forEach(d => {
      let end = new Date(d.task.plannedEndDate);
      let start = new Date(d.task.plannedStartDate)
      let days = differenceInDays(end, start);
      let initial = new Date(start);
      let count = 0;

      let perDayCost = d.total / days
      let prevDate = new Date(initial);
      while (initial <= end) {
        if (prevDate.getMonth() < initial.getMonth() || differenceInDays(end, initial) == 0) {
          let ref = monthlyLabor[startOfMonth(initial)];
          let total = (count * perDayCost);
          if (!ref) monthlyLabor[startOfMonth(initial)] = { actual: { total: 0, qty: 0 }, planned: { total, qty: count } };
          else {
            monthlyLabor[startOfMonth(initial)].planned.total += total;
            monthlyLabor[startOfMonth(initial)].planned.qty += count;
          }
          count = 1;
        }
        prevDate = new Date(initial);
        count++;
        initial = addDays(initial, 1)
      }
    });

    query = [
      {
        $match: {
          $and: [{ project }, { boqType: '1' }]
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { date: "$monitoringDate", format: "%m-01-%Y" } },
            task: "$task"
          },
          monitoringDate: { $last: "$monitoringDate" },
          total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
        }
      },
      {
        $lookup:
        {
          from: "tasks",
          localField: "_id.task",
          foreignField: "_id",
          as: "task"
        }
      },


    ];

    result = await taskUtilizedResourceModel.aggregate(query);

    result.forEach((row, i) => {
      let month = new Date(row._id.month);
      let fromDate = row.task[0].actualStartDate;
      if (result[i - 1] && result[i - 1].task.toString() == row._id.task.toString()) fromDate = result[i - 1].monitoringDate;
      let days = differenceInDays(row.monitoringDate, fromDate);
      let total = row.total;
      if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
      else {
        monthlyLabor[month].actual.total += total;
        monthlyLabor[month].actual.qty += days;
      }
    })

    let monthlyLaborData = Object.keys(monthlyLabor).sort((a, b) => a < b).map(key => ({ month: new Date(key), planned: monthlyLabor[key].planned, actual: monthlyLabor[key].actual }));
    //       monthlyLaborData = monthlyLaborData.filter(row => row.actual.total > 0);
    // console.table(monthlyLaborData)
    let data = {
      monthlyLaborData,

    };
    return res.json({ success: true, data: data });
  } catch (error) {
    console.log(error)
    respondWithError(res, error, 'Error when getting task.');
  }
},