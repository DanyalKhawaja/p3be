const dateFormat = require("dateformat");
var mongoose = require("mongoose");
const _get = require('lodash.get');
const { respondWithError, nextCycle, getFirstDate, getFt, businessDays } = require('./common');

const ObjectId = mongoose.Types.ObjectId;

const taskModel = require("../models/taskModel");
const monitoringModel = require("../models/monitoringModel");
const taskUtilizedResourceModel = require("../models/taskUtilizedResourceBaseModel");
const taskPlannedResourceModel = require("../models/taskPlannedResourceBaseModel");
const log = require("../lib/logger");

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskModel.find(function (err, task) {
        if (err) respondWithError(res, err, "Error when getting task.");
        const LOGMESSAGE = DATETIME + "|task List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var projectId = req.params.projectId;
      taskModel
        .find({ taskId: id, project: projectId })
        .exec(function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "|task Found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },

  showExecutionsPendingByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      taskModel
        .find({ project: id, actualStartDate: null, $or: [{ $and: [{ plannedStartDate: { $lte: new Date() } }, { workPackage: true }] }, { workPackage: false }] }, function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "|task found of project:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        })
        .sort({ taskId: 1 })
        .populate("ProjectLocation", "projectLocationName");
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },


  showTaskByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      taskModel
        .find({ project: id }, function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "|task found of project:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        })
        .sort({ taskId: 1 })
        .populate("ProjectLocation", "projectLocationName");
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showExecutedTasksByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      let qq = {
        project: id,
        plannedStartDate: {
          $lte: new Date()
        },
        $or: [{
          $and: [{
            actualStartDate: {
              $ne: null
            }
          }, {
            monitoringStatus: {
              $nin: ['CLOSED', 'SYSTEM']
            }
          }, {
            completed: { $ne: 100 }
          }]
        }, {
          workPackage: false
        }]
      };

      taskModel.find(qq, function (err, task) {
        if (err) respondWithError(res, err, "Error when getting task.");
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + "|task found of project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
        // return res.json(task);
      })
        .sort({ taskId: 1 })
        .populate("ProjectLocation", "projectLocationName");
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showWPTasksByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var id = req.params.id;
      let currentProject = { project: ObjectId(id) };
      let monitorings = await monitoringModel.find(currentProject).populate('task', ['projectLocation', 'actualStartDate', 'actualEndDate']);
      let query =
        [
          { $sort: { lastMonitoringDate: 1 } },
          { $match: currentProject },
          { $group: { _id: "$taskId", actualCost: { $sum: "$actualCost" }, completion: { $last: "$completion" }, lastMonitoringDate: { $last: "$monitoringDate" } } }
        ];
      let monitoringsCost = await monitoringModel.aggregate(query);
      let rootTask = await taskModel.findOne({ project: ObjectId(id), taskId: '0' }).lean();
      let firstExecutedTask = await taskModel.findOne({ project: ObjectId(id), actualStartDate: { $ne: null }, workPackage: true }).sort({ actualStartDate: 1 }).lean();
      let allWPTasks = await taskModel.find({ project: ObjectId(id), workPackage: true }).populate('projectLocation', 'pathId').sort({ plannedStartDate: 1 }).lean();
      //, plannedEndDate: { $lte: new Date() } 
      let weightageMap = allWPTasks.reduce((map, task) => { map[task.taskId] = task.weightage; return map; }, {});
      let tasks = allWPTasks;
      let monPlnBrk = allWPTasks.reduce((map, task) => {
        let plannedEndDate = new Date(task.plannedEndDate);
        let monthID = getFirstDate(plannedEndDate);
        if (!map.monthly[monthID]) map.monthly[monthID] = {
          plannedCost: 0,
          plannedCompletion: 0,
          cumPlnCost: 0,
          cumPlnComp: 0,
          cumPlnVal: 0,
        };
        map.monthly[monthID].plannedCost = map.monthly[monthID].plannedCost + task.plannedCost;
        map.monthly[monthID].plannedCompletion = map.monthly[monthID].plannedCompletion + weightageMap[task.taskId];
        map.budAtComp = map.budAtComp + task.plannedCost
        return map;
      }, { budAtComp: 0, monthly: {} });

      let monActBrk = monitoringsCost.reduce((map, task) => {
        let monthID = getFirstDate(new Date(task.lastMonitoringDate));
        if (!map.monthly[monthID] && task.completion == 100) map.monthly[monthID] = {
          actualCost: 0,
          actualCompletion: 0,
          cumActCost: 0,
          cumulativeActualCompletion: 0,
          cumEarVal: 0,
        };

        if (task.completion == 100) {
          map.totalActualCost += task.actualCost;
          map.totalActualCompletion += weightageMap[task._id];
          map.monthly[monthID].actualCost += task.actualCost;
          map.monthly[monthID].actualCompletion += weightageMap[task._id];
        }
        return map;
      }, {
        totalActualCost: 0,
        totalActualCompletion: 0,
        monthly: {}
      });


      // map[monthID].cumActCost = map.totalActualCost;
      // map[monthID].cumulativeActualCompletion = map.totalActualCompletion;
      let prev = null;
      let firstD = null;
      Object.keys(monActBrk.monthly).sort((a, b) => (new Date(a)) - (new Date(b))).forEach(key => {
        if (!firstD) firstD = key;
        // monActBrk.monthly[key].cumActCost = (prev ? monActBrk.monthly[prev].cumActCost : 0) + monActBrk.monthly[key].actualCost;
        monActBrk.monthly[key].cumActCost = _get(monActBrk, `monthly.${prev}.cumActCost`, 0) + monActBrk.monthly[key].actualCost;
        monActBrk.monthly[key].cumulativeActualCompletion = _get(monActBrk, `monthly.${prev}.cumulativeActualCompletion`, 0) + monActBrk.monthly[key].actualCompletion;
        monActBrk.monthly[key].cumEarVal = monActBrk.monthly[key].cumulativeActualCompletion * monPlnBrk.budAtComp;
        prev = key;
      });
      let lastMonitoredMonth = prev;
      prev = null;
      let EVMValuesPerMonth = [];
      //let D = [monActBrk.monthly[firstD] ? monActBrk.monthly[firstD].cumActCost : 0];
      let D = [_get(monActBrk, `mon.${firstD}.cumActCost`, 0)];
      let A = [D[0]], T = [0];
      Object.keys(monPlnBrk.monthly).sort((a, b) => (new Date(a)) - (new Date(b))).forEach((key, t) => {
        // monPlnBrk.monthly[key].cumPlnCost = (prev ? monPlnBrk.monthly[prev].cumPlnCost : 0) + monPlnBrk.monthly[key].plannedCost;
        monPlnBrk.monthly[key].cumPlnCost = _get(monPlnBrk, `monthly.${prev}.cumPlnCost`, 0) + monPlnBrk.monthly[key].plannedCost;
        monPlnBrk.monthly[key].cumPlnComp = _get(monPlnBrk, `monthly.${prev}.cumPlnComp`, 0) + monPlnBrk.monthly[key].plannedCompletion;
        monPlnBrk.monthly[key].cumPlnVal = monPlnBrk.monthly[key].cumPlnComp * monPlnBrk.budAtComp;
        let month = (['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][(new Date(key)).getMonth()]) + '-' + (new Date(key)).getFullYear();
        D.push(monActBrk.monthly[key] ? monActBrk.monthly[key].cumActCost : 0);
        EVMValuesPerMonth.push({
          RecordDate: month,
          LastMonitoring: lastMonitoredMonth == key,
          PV: monPlnBrk.monthly[key].cumPlnVal,
          AC: _get(monActBrk, `monthly.${key}.cumActCost`, 0),
          EV: _get(monActBrk, `monthly.${key}.cumEarVal`, 0),
          FV: t > 0 ? (EVMValuesPerMonth[t - 1].FV + getFt(t, D, A, T)) : 0
          // FV: monPlnBrk.monthly[key].cumPlnVal * 1.05
        });
        prev = key;
      });


      let lastPlannedMonth = prev;
      // lastMonitoredMonth = prev;
      //  lastMonitoredMonth = (new Date('2020-05-01')).toString();
      let budAtComp = monPlnBrk.budAtComp;
      // let plannedValue =monPlnBrk.monthly[lastMonitoredMonth].cumPlnVal ? monPlnBrk.monthly[lastMonitoredMonth].cumPlnVal:0;
      // let earnedValue = monActBrk.monthly[lastMonitoredMonth] ? monActBrk.monthly[lastMonitoredMonth].cumEarVal : 0;
      // let actualCost = monActBrk.monthly[lastMonitoredMonth] ? monActBrk.monthly[lastMonitoredMonth].cumActCost : 0;

      let plannedValue = _get(monPlnBrk, `monthly.${lastPlannedMonth}.cumPlnVal`, 0);
      let earnedValue = _get(monActBrk, `monthly.${lastMonitoredMonth}.cumEarVal`, 0);
      let actualCost = _get(monActBrk, `monthly.${lastMonitoredMonth}.cumActCost`, 0);
      let actualCostNonCumulative = _get(monActBrk, `monthly.${lastMonitoredMonth}.actualCost`, 0);

      let costVariance = earnedValue - actualCost;
      let scheduleVariance = earnedValue - plannedValue;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = "On Schedule";
      if (scheduleVariance > 0) scheduleStatus = "Ahead of schedule";
      if (scheduleVariance < 0) scheduleStatus = "Behind schedule";
      let costStatus = "On budget";
      if (costVariance > 0) costStatus = "Under budget";
      if (costVariance < 0) costStatus = "Over budget";
      let CPI = earnedValue / actualCost;
      let SPI = earnedValue / plannedValue;
      // let estimateAtCompletion = actualCost + ((budAtComp - earnedValue) / (SPI * CPI));
      let estimateAtCompletion = budAtComp  /CPI;
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      v = (estimateAtCompletion - actualCost);
      let TCPI = (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) ;
      let averageMonthlyCost = budAtComp / Object.keys(monPlnBrk.monthly).length;
      let actualDaysSinceExecution = businessDays(firstExecutedTask ? firstExecutedTask.actualStartDate : new Date(), new Date());
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);
      let performanceData = {
        PerformanceCostData: {
          ActualCost: actualCostNonCumulative, // actual cost for the current month
          AverageMonthlyCost: averageMonthlyCost, // total cost divided by the total budget
          PurpleRange: [0, averageMonthlyCost],
          YellowRange: [averageMonthlyCost, averageMonthlyCost * 1.25],
          RedRange: [averageMonthlyCost * 1.25, averageMonthlyCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0],// plus management reserve
          RedRange: [budAtComp + 0, (budAtComp + 0) * 1.25]
        },
        PerformanceScheduleData: {
          TotalPlannedDays: totalPlannedDays, // duration of the least and maximum dates from all the tasks in ProjectTasks
          TotalDaysSpent: actualDaysSinceExecution, // duration of the least and maximum date from all the monitoring
          PurpleRange: [0, totalPlannedDays],
          YellowRange: [totalPlannedDays, totalPlannedDays * 1.25],
          RedRange: [totalPlannedDays * 1.25, totalPlannedDays * 1.75]
        }
      };


      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { $or: [{ boqType: '1' }, { "__type": "TaskUtilizedResource" }] }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$actualCostPerUnit", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});;

      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { $or: [{ boqType: '1' }, { "__type": "TaskPlannedResource" }] }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$cost", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];

      let plannedResourceBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});;

      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '1' }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$actualCostPerUnit", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let actualLaborBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});;


      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '1' }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$cost", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let plannedLaborBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});


      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '3' }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$actualCostPerUnit", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let actualContractorEquipmentBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});


      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '3' }]
          }
        }, {
          $group: { _id: { task: "$task" }, total: { $sum: { $multiply: ["$cost", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let plannedContractorEquipmentBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});
      ;

      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        }, {
          $group: { _id: { task: "$task", rankId: "$top3", material: "$description" }, total: { $sum: { $multiply: ["$cost", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];
      let consumableMaterialBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task][row._id.rankId] = { material: row._id.material, Planned: { qty: row.qty, total: row.total } };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project: ObjectId(id) }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        }, {
          $group: { _id: { task: "$task", rankId: "$top3" }, total: { $sum: { $multiply: ["$actualCostPerUnit", "$quantity"] } }, qty: { $sum: "$quantity" } }
        }
      ];

      // let consumableMaterialBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
      //   // if (!obj[row._id.task]) obj[row._id.task] = {};
      //   obj[row._id.task][row._id.rankId].Actual = {  qty: row.qty, total: row.total };
      //   return obj;
      // }, plannedConsumableMaterialBreakup);

      let utilizedResources = await taskUtilizedResourceModel.aggregate(query);
      utilizedResources.forEach(row => {
        consumableMaterialBreakup[row._id.task][row._id.rankId].Actual = { qty: row.qty, total: row.total };
      });
      let data = {
        monitorings,
        estimateAtCompletion,
        TCPI,
        scheduleVarianceInDays,
        scheduleVariance,
        scheduleStatus,
        costVariance,
        costStatus,
        performanceData,
        CPI,
        SPI,
        varianceAtCompletion,
        budAtComp,
        tasks,
        monitoringsCost,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        EVMValuesPerMonth
      }
      return res.json({ success: true, data: data });

    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },

  showStartDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskModel
        .find({ project: id }, "plannedStartDate")
        .exec(function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showEndDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskModel
        .find({ project: id }, "plannedEndDate")
        .exec(function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showTotalPlannedCostByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      console.log(id);
      taskModel.aggregate(
        [
          {
            $match: {
              project: ObjectId(id),
              workPackage: true,
            },
          },
          {
            $group: {
              _id: null,
              plannedCost: { $sum: "$plannedCost" },
            },
          },
        ],
        // [{ project: id, workPackage: true ,"totalPlannedCost":{$sum:'$plannedCost'}}]).exec(
        function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        }
      );
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showMilestonesByProjetId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      taskModel
        .find({ project: id, milestone: true })
        .exec(function (err, task) {
          if (err) respondWithError(res, err, "Error when getting project.");
          if (!task) {
            respondWithNotFound(res, 'No such task');
          } else if (task.length == 0) {
            const LOGMESSAGE = DATETIME + "|No such milestone found";
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No milestone found",
            });
          }
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  showWorkPackagesByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      taskModel
        .find({ project: id, workPackage: true })
        .exec(function (err, task) {
          if (err) respondWithError(res, err, "Error when getting project.");
          if (!task) {
            respondWithNotFound(res, 'No such task');
          } else if (task.length == 0) {
            const LOGMESSAGE = DATETIME + "|No such workpackage found";
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No workpackage found",
            });
          }
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      var task = new taskModel(req.body);
      taskModel.create(req.body, function (err, task) {
        if (err) respondWithError(res, err, "Error when getting task.");
        const LOGMESSAGE = DATETIME + "|task created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(task);
        return res.json({ success: true, msg: "task is created", data: task });
      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  wbs: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskModel.deleteMany({ project: req.body[0].project }, function (
        err,
        task
      ) {
        if (err) respondWithError(res, err, "Error when deleting task.");
        if (!task) respondWithNotFound(res, 'No such task');

        taskModel.insertMany(req.body, function (err, data) {
          if (err) respondWithError(res, err, "Error when creating task.");
          const LOGMESSAGE = DATETIME + "|task created";
          log.write("INFO", LOGMESSAGE);
          // return res.status(201).json(task);
          return res.json({
            success: true,
            msg: req.body.length + " task(s) created",
            data: data,
          });
        });


      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },

  updateWorkPackages: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {

      var id = req.params.id;
      var arrBody = req.body.workPackages;
      arrBody.forEach((element, index) => {
        // console.log(element)
        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          if (element.actualStartDate) task.actualStartDate = element.actualStartDate;
          if (element.completed) task.completed = element.completed;
          task.updatedDate = DATETIME;
          task.updatedBy = element.updatedBy
            ? element.updatedBy
            : task.updatedBy;
          // console.log(task)
          task.save(function (err, task) {
            if (err) respondWithError(res, err, "Error when updating task.");
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + "|Updated task:" + id;
              log.write("INFO", LOGMESSAGE);
              return res.json({ success: true, msg: "task list is updated" });
            }
            // return res.json(task);
          });
        });
      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  markMonitorings: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {

      var id = req.params.id;
      taskModel.find({
        project: id,
        monitoringstatus: {
          $ne: 'OPEN'
        },
        actualStartDate: {
          $lte: new Date()
        },
        workPackage: true
        ,
        completed: {
          $ne: 100
        },
        $or: [{
          lastMonitoredOn: null
        }, {
          lastMonitoredOn: {
            $lt: new Date()
          }
        }]

      }
        , function (err, tasks) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!tasks) {
            const LOGMESSAGE = DATETIME + "|NO Such task of project:" + id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such task",
            });
          }

          tasks.forEach(async currTask => {
            // console.log(element)
            let nextCycleData = nextCycle(currTask.monitoringFrequency, currTask.plannedStartDate, currTask.plannedEndDate)[0];
            currTask.cycleEndsOn = nextCycleData.date;
            currTask.cycleDays = nextCycleData.days;
            currTask.monitoringStatus = 'OPEN';
            await currTask.save(function (err, Ttask) {
              if (err) respondWithError(res, err, "Error when updating task.");

              const LOGMESSAGE = DATETIME + "|Updated task:";
              log.write("INFO", LOGMESSAGE);
              // return res.json({ success: true, msg: "task list is updated" });
            });

          });
          const LOGMESSAGE = DATETIME + "|task found of project:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: [] });
          // return res.json(task);



        });



    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  updateWorkPackage: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var element = req.body.workPackage;
      taskModel.findOne({ _id: element._id }, function (err, task) {
        if (err) respondWithError(res, err, "Error when getting task.");
        if (!task) respondWithNotFound(res, 'No such task');

        if (element.monitoringStatus) task.monitoringStatus = element.monitoringStatus;
        if (element.actualStartDate) task.actualStartDate = element.actualStartDate;
        if (element.quantityConsumed) task.quantityConsumed = (task.quantityConsumed ? task.quantityConsumed : 0) + element.quantityConsumed;
        if (element.costIncurred) task.costIncurred = (task.costIncurred ? task.costIncurred : 0) + element.costIncurred;
        if (element.lastMonitoredOn) task.lastMonitoredOn = DATETIME;
        if (element.completed) task.completed = element.completed;
        if (element.updatedBy) task.updatedBy = element.updatedBy
        task.updatedDate = DATETIME;
        task.save(function (err, task) {
          if (err) respondWithError(res, err, "Error when updating task.");
          const LOGMESSAGE = DATETIME + "|Updated task:" + element._id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "task list is updated" });
        });
      });

    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  updateMonitoredWorkPackage: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var monitoredWorkPackages = req.body;
      monitoredWorkPackages.forEach(async d => {
        await taskModel.updateOne({ _id: d._id }, { actualCost: d.actualCost, lastMonitoredOn: DATETIME, ...(d.completed && { monitoringStatus: d.monitoringStatus, completed: d.completed }) });
      });
      const LOGMESSAGE = DATETIME + "|Updated tasks:";
      log.write("INFO", LOGMESSAGE);
      return res.status(200).json({
        success: true,
        msg: "Monitored Tasks updated",
        error: null,
      });

    }
    //   taskModel.findOne({ _id: element._id }, function (err, task) {
    //     if (err) {
    //       const LOGMESSAGE = DATETIME + "|" + err.message;
    //       log.write("ERROR", LOGMESSAGE);
    //       return res.status(500).json({
    //         success: false,
    //         msg: "Error when getting task",
    //         error: err,
    //       });
    //     }
    //     if (!task) {
    //       const LOGMESSAGE =
    //         DATETIME + "|No such task to update:" + element._id;
    //       log.write("ERROR", LOGMESSAGE);
    //       return res.status(404).json({
    //         success: false,
    //         msg: "No such task with id" + element._id,
    //       });
    //     }

    //     if (element.monitoringStatus) task.monitoringStatus = element.monitoringStatus;
    //     task.lastMonitoredOn = DATETIME;
    //     if (element.actualStartDate) task.actualStartDate = element.actualStartDate;
    //     if (element.quantityConsumed) task.quantityConsumed = (task.quantityConsumed ?? 0) + element.quantityConsumed;
    //     if (element.actualCost) task.actualCost = (task.actualCost ?? 0) + element.actualCost;
    //     if (element.lastMonitoredOn) task.lastMonitoredOn =  DATETIME;
    //     if (element.completed) task.completed = element.completed;
    //     if (element.updatedBy) task.updatedBy = element.updatedBy
    //     task.updatedDate = DATETIME;
    //     task.save(function (err, task) {
    //       if (err) {
    //         const LOGMESSAGE = DATETIME + "|" + err.message;
    //         log.write("ERROR", LOGMESSAGE);
    //         return res.status(500).json({
    //           success: false,
    //           msg: "Error when updating task.",
    //           error: err,
    //         });
    //       }

    //       const LOGMESSAGE = DATETIME + "|Updated task:" + element._id;
    //       log.write("INFO", LOGMESSAGE);
    //       return res.json({ success: true, msg: "task list is updated" });
    //     });
    //   });

    catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {
        // console.log(element)
        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) respondWithError(res, err, "Error when getting task.");
          if (!task) respondWithNotFound(res, 'No such task');
          // console.log(req.body)
          console.log(element.project);

          task.project = element.project ? element.project : task.project;
          task.monitoringFrequency = element.monitoringFrequency
            ? element.monitoringFrequency
            : task.monitoringFrequency;
          task.parentTask = element.parentTask
            ? element.parentTask
            : task.parentTask;
          task.description = element.description
            ? element.description
            : task.description;
          task.plannedStartDate = element.plannedStartDate
            ? element.plannedStartDate
            : task.plannedStartDate;
          task.plannedEndDate = element.plannedEndDate
            ? element.plannedEndDate
            : task.plannedEndDate;
          task.workPackage = element.workPackage;
          task.plannedCost = element.plannedCost
            ? element.plannedCost
            : task.plannedCost;
          task.milestone = element.milestone;
          task.updatedDate = DATETIME;
          task.updatedBy = element.updatedBy
            ? element.updatedBy
            : task.updatedBy;
          // console.log(task)
          task.save(function (err, task) {
            if (err) respondWithError(res, err, "Error when updating task.");
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + "|Updated task:" + id;
              log.write("INFO", LOGMESSAGE);
              return res.json({ success: true, msg: "task list is updated" });
            }
            // return res.json(task);
          });
        });
      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.taskId;
      var projectId = req.params.projectId;
      console.log({ taskId: id, project: projectId });

      taskModel.deleteOne({ taskId: id, project: projectId }, function (
        err,
        task
      ) {
        if (err) respondWithError(res, err, "Error when deleting task.");
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + "|removed task:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "task is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      respondWithError(res, error, "Error when getting task.");
    }
  },
};
