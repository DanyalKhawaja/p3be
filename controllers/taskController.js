const dateFormat = require('dateformat');
var ObjectId = require('mongoose').Types.ObjectId;
const { differenceInDays } = require('date-fns');

const _ = require('lodash');




const { isBusinessDay, createDates, createMonthlyArray, respondWithError, nextCycle, getFt, businessDays } = require('./common');

const portfolioModel = require('../models/portfolioModel');

const projectModel = require('../models/projectModel');
const taskModel = require('../models/taskModel');
const monitoringModel = require('../models/monitoringModel');
const taskUtilizedResourceModel = require('../models/taskUtilizedResourceBaseModel');
const taskPlannedResourceModel = require('../models/taskPlannedResourceBaseModel');
const log = require('../lib/logger');
const programModel = require('../models/programModel');
const endOfMonth = require('date-fns/endOfMonth');
const addDays = require('date-fns/addDays');
var startOfMonth = require('date-fns/startOfMonth');
var addMonths = require('date-fns/addMonths');





module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      taskModel.find(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        const LOGMESSAGE = DATETIME + '|task List found';
        log.write('INFO', LOGMESSAGE);
        return res.json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id.toString();
      var projectId = req.params.projectId;
      taskModel.find({ taskId: id, project: projectId }).exec(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + '|task Found';
        log.write('INFO', LOGMESSAGE);
        return res.json({ success: true, data: task });
        // return res.json(task);
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  dueExecutionByProject: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;

      taskModel
        .find(
          {
            project: id,
            actualStartDate: null,
            plannedStartDate: { $lte: new Date() },
            workPackage: true
          },
          function (err, task) {
            if (err) respondWithError(res, err, 'Error when getting task.');
            if (!task) respondWithNotFound(res, 'No such task');
            const LOGMESSAGE = DATETIME + '|task found of project:' + id;
            log.write('INFO', LOGMESSAGE);
            return res.json({ success: true, data: task });
            // return res.json(task);
          }
        )
        .sort({ taskId: 1 })
        .populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  showTaskByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;

      taskModel
        .find({ project: id }, function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + '|task found of project:' + id;
          log.write('INFO', LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        })
        // .sort({ taskId: 1 })
        .populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  openByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;
      let qq = {
        project: id,
        actualStartDate: {
          $ne: null
        },
        monitoringStatus: {
          $nin: ['CLOSED', 'SYSTEM']
        },
        completed: { $ne: 100 },
        workPackage: true
      };

      taskModel
        .find(qq, function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + '|task found of project:' + id;
          log.write('INFO', LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        })
        .sort({ parentTask: 1, taskId: 1 })
        .populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  workedByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;
      let qq = {
        project: id,
        actualStartDate: {
          $ne: null
        },
        monitoringStatus: {
          $nin: ['CLOSED', 'SYSTEM']
        },
        workPackage: true
      };

      taskModel
        .find(qq, function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + '|task found of project:' + id;
          log.write('INFO', LOGMESSAGE);
          return res.json({ success: true, data: task });
          // return res.json(task);
        })
        .sort({ parentTask: 1, taskId: 1 })
        .populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  dashboardByProgramId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var program = ObjectId(req.params.id);
      var programId = program.toString();
      var projects = (await projectModel.find({ program }, { _id: 1 }).lean()).map((d) => d._id);
      let allProjects = await projectModel.find({ program }, { _id: 1, name: 1 }).lean();
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate([{
        $match: {
          $and: [
            { project: { $in: projects } },
            { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }
          ]
        }
      },
      {
        $group: {
          _id: { project: "$project" },
          total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
        }
      }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
        return obj;
      }, {});

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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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


      let projectWiseConsumedMaterial = await taskUtilizedResourceModel.aggregate([
        {
          $match: {
            $and: [{ project: { $in: projects } }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { program: programId, rankId: '$top3' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
          }
        }
      ]);



      let programTotal = 0;
      let projectCostAndCompletion = (await taskModel.aggregate([
        { $sort: { plannedStartDate: 1 } },
        { $match: { project: { $in: projects }, workPackage: true } },
        {
          $group: {
            _id: { project: "$project" },
            actual: { $sum: '$actualCost' },
            planned: { $sum: '$plannedCost' },
            completion: { $sum: { $multiply: ['$weightage', '$completed'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project].actual = row.actual;
        obj[row._id.project].planned = row.planned;
        obj[row._id.project].completion = row.completion;
        programTotal += row.planned;
        return obj;
      }, {});



      for (let key in projectCostAndCompletion) {
        projectCostAndCompletion[key].weightage = projectCostAndCompletion[key].planned / programTotal;
      }
      let allWPTasks = await taskModel.find({
        project: { $in: projects },
        workPackage: true
      })
        .lean()
        .sort({ plannedStartDate: 1 });
      let tasks = allWPTasks;



      let projectsSchedule = await projectModel.aggregate([{
        $match: { program },
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

      let programData = await programModel.findById(programId);
      let programSchedule = {
        [programId]: {
          programActualDays: businessDays(new Date(programData.startDate), new Date()),
          programPlannedDays: businessDays(new Date(programData.startDate), new Date(programData.endDate))
        }
      }

      projectsSchedule = projectsSchedule.reduce((obj, row) => {
        if (!obj[row._id]) obj[row._id] = {};
        obj[row._id].projectActualDays = row.projectActualDays;
        obj[row._id].projectPlannedDays = row.projectPlannedDays;
        return obj;
      }, {});



      let monthwisePlanned = await taskModel.aggregate([{
        $match: { project: { $in: projects }, workPackage: true }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$plannedEndDate" } },
          firstDate: { $first: "$plannedEndDate" },
          lastDate: { $last: "$plannedEndDate" },
          plannedCost: { $sum: "$plannedCost" },
          plannedCompletion: { $sum: "$weightage" },
          actualCompletion: { $sum: { $divide: [{ $multiply: ["$weightage", "$completed"] }, 100] } },
        }
      },
      {
        $sort: { "_id": 1 }
      }]);


      let monthwiseActual = await monitoringModel.aggregate([{
        $match: { project: { $in: projects } }
      }, {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$monitoringDate" } },
          actualCost: { $sum: "$actualCost" },
          lastDate: { $last: "$monitoringDate" },
        }
      },
      {
        $sort: { "_id": 1 }
      }]);
      let config = {
        plannedCost: 0,
        plannedCompletion: 0,
        actualCompletion: 0,
        actualCost: 0,
        cumulativePlannedCost: 0,
        cumulativePlannedCompletion: 0,
        cumulativeActualCompletion: 0,
        cumulativeActualCost: 0,
        cumulativePlannedValue: 0,
        cumulativeEarnedValue: 0
      };

      let monthList = createMonthlyArray(monthwisePlanned[0].firstDate, undefined, config)
      let monthwiseData = _.values(_.merge(_.keyBy(monthList, '_id'), _.keyBy(monthwisePlanned, '_id'), _.keyBy(monthwiseActual, '_id')));
      monthwiseData = monthwiseData.sort((a, b) => new Date(a._id) < new Date(b._id) ? -1 : 1)

      monthwiseData[monthwiseActual.length - 1].isLastMonitoring = true;
      monthwiseData.forEach((doc, i, docs) => {
        if (!doc.plannedCost) doc.plannedCost = 0;
        if (!doc.plannedCompletion) doc.plannedCompletion = 0;
        if (!doc.cumulativePlannedCost) doc.cumulativePlannedCost = 0;
        if (!doc.actualCompletion) doc.actualCompletion = 0;
        if (!doc.cumulativeActualCompletion) doc.cumulativeActualCompletion = 0;
        let previous = docs[i - 1];
        doc.cumulativePlannedCost = previous ? doc.plannedCost + previous.cumulativePlannedCost : doc.plannedCost;
        doc.cumulativePlannedCompletion = previous ? doc.plannedCompletion + previous.cumulativePlannedCompletion : doc.plannedCompletion;
        doc.cumulativeActualCompletion = previous ? doc.actualCompletion + previous.cumulativeActualCompletion : doc.actualCompletion;
        doc.cumulativeActualCost = previous ? (doc.actualCost ? doc.actualCost : 0) + previous.cumulativeActualCost : doc.actualCost;
      });
      // console.log(monthwiseData)
      monthwiseData.forEach((doc, i, docs) => {
        let previous = docs[i - 1], final = docs[docs.length - 1];
        if (!doc.cumulativePlannedValue) doc.cumulativePlannedValue = 0;
        if (!doc.cumulativeEarnedValue) doc.cumulativeEarnedValue = 0;

        doc.cumulativePlannedValue = previous ? previous.cumulativePlannedValue + (doc.plannedCompletion * final.cumulativePlannedCost) : doc.plannedCompletion * (final.cumulativePlannedCost ? final.cumulativePlannedCost : 0);
        doc.cumulativeEarnedValue = previous ? previous.cumulativeEarnedValue + (doc.actualCompletion * final.cumulativePlannedCost) : doc.actualCompletion * (final.cumulativePlannedCost ? final.cumulativePlannedCost : 0);
      });

      let D = [], A = [monthwiseData[0].cumulativeActualCost], T = [0];

      monthwiseData.forEach((doc, i, docs) => {
        D.push(doc.actualCost);
        doc.FV = i > 0 ? docs[i - 1].FV + getFt(i, D, A, T) : 0;
        // 
      });

      let currentMonthRow = monthwiseData.find(d => {
        let y = startOfMonth(new Date(d._id)).valueOf() == startOfMonth(new Date()).valueOf()
        return y;
      });

      let actualCost = currentMonthRow ? currentMonthRow.cumulativeActualCost : 0;
      let currentMonthActualCost = currentMonthRow ? currentMonthRow.actualCost : 0;
      let currentMonthPlannedCost = currentMonthRow ? currentMonthRow.plannedCost : 0;
      let budAtComp = monthwiseData[monthwiseData.length - 1].cumulativePlannedCost;
      let averageMonthlyCost = budAtComp / monthwiseData.length;

      let totalPlannedDays = programSchedule[programId].programPlannedDays;
      let actualDaysSinceExecution = programSchedule[programId].programActualDays;
      let performanceData = {
        PerformanceCostData: {
          ActualCost: currentMonthActualCost, // actual cost for the current month
          AverageMonthlyCost: currentMonthPlannedCost, // total cost divided by the total budget
          PurpleRange: [0, currentMonthPlannedCost],
          YellowRange: [currentMonthPlannedCost, currentMonthPlannedCost * 1.25],
          RedRange: [currentMonthPlannedCost * 1.25, currentMonthPlannedCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0], // plus management reserve
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


      let data = {
        monthwiseData,
        projectCostAndCompletion,
        allProjects,
        performanceData,
        projectsSchedule,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        allWPTasks
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  projectsByPortfolioId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var portfolio = ObjectId(req.params.id);
      var programs = (await programModel.find({ portfolio }, { _id: 1 }).lean()).map(d => d._id);
      var projects = (await projectModel.find({ program: { $in: programs } }, { _id: 1 }).lean()).map((d) => d._id);
      let allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, name: 1 }).lean();


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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
            _id: { project: "$project" },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project] = row.total;
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
      let programTotal = 0;
      let projectCostAndCompletion = (await taskModel.aggregate([
        { $sort: { plannedStartDate: 1 } },
        { $match: { project: { $in: projects }, workPackage: true } },
        {
          $group: {
            _id: { project: "$project" },
            actual: { $sum: '$actualCost' },
            planned: { $sum: '$plannedCost' },
            completion: { $sum: { $multiply: ['$weightage', '$completed'] } }
          }
        }
      ])).reduce((obj, row) => {
        if (!obj[row._id.project]) obj[row._id.project] = {};
        obj[row._id.project].actual = row.actual;
        obj[row._id.project].planned = row.planned;
        obj[row._id.project].completion = row.completion;
        programTotal += row.planned;
        return obj;
      }, {});



      // for (let key in projectCostAndCompletion) {
      //   projectCostAndCompletion[key].weightage = projectCostAndCompletion[key].planned / programTotal;
      // }
      let allWPTasks = await taskModel.find({
        project: { $in: projects },
        workPackage: true
      })
        .lean()
        .sort({ plannedStartDate: 1 });
      let tasks = allWPTasks;



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

      projectsSchedule = projectsSchedule.reduce((obj, row) => {
        if (!obj[row._id]) obj[row._id] = {};
        obj[row._id].projectActualDays = row.projectActualDays;
        obj[row._id].projectPlannedDays = row.projectPlannedDays;
        return obj;
      }, {});

      let data = {
        projectCostAndCompletion,
        allProjects,
        consumableMaterialBreakup,
        plannedResourceBreakup,
        plannedLaborBreakup,
        plannedContractorEquipmentBreakup,
        projectsSchedule,
        allWPTasks
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  dashboardByPortfolioId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var portfolio = ObjectId(req.params.id);
      var allPrograms = await programModel.find({ portfolio }, { _id: 1, name: 1 }).lean();

      var programs = allPrograms.map((d) => d._id);
      var projects = (await projectModel.find({ program: { $in: programs } }, { _id: 1 }).lean()).map((d) => d._id);
      var portfolioId = portfolio.toString();
      //let allProjects = await projectModel.find({ program }, { _id: 1, name: 1 }).lean();

      let allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, name: 1, program: 1 }).populate('program', 'name').lean();

      let programMap = allProjects.reduce((ob, project) => {
        ob[project._id] = project.program._id.toString();
        return ob;
      }, {})



      // let programMap = new Map(allProjects.reduce((ar, project) => {
      //   ar.push([project._id.toString(), project.program._id]);
      //   return ar;
      // }, []));
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate([{
        $match: {
          $and: [
            { project: { $in: projects } },
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
        return obj;
      }, {});

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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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


      let projectWiseConsumedMaterial = await taskUtilizedResourceModel.aggregate([
        {
          $match: {
            $and: [{ project: { $in: projects } }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { portfolio: portfolioId, rankId: '$top3' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } }
          }
        }
      ]);



      let portfolioTotal = 0;
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
        if (!obj[prop]) obj[prop] = { actual: 0, planned: 0, completion: 0 };
        obj[prop].actual += row.actual;
        obj[prop].planned += row.planned;
        obj[prop].completion += row.completion;
        portfolioTotal += row.planned;
        return obj;
      }, {});

      for (let key in programCostAndCompletion) {
        programCostAndCompletion[key].weightage = programCostAndCompletion[key].planned / portfolioTotal;
      }

      let allWPTasks = await taskModel.find({
        project: { $in: projects },
        workPackage: true
      })
        .lean()
        .sort({ plannedStartDate: 1 });
      let tasks = allWPTasks;



      let weightageMap = allWPTasks.reduce((map, task) => {
        map[task.taskId] = task.weightage;
        return map;
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

      // .reduce((obj, row) => {
      //   let prop = programMap[row._id.toString()];
      //   if (!obj[prop]) obj[prop] = 0;
      //   obj[prop] += row.total;
      //   return obj;
      // }, {});

      // let programSchedule = projectsSchedule.reduce((obj, row, i, array) => {
      //   if (!obj[programId]) obj[programId] = { programActualDays: 0, programPlannedDays: 0 };
      //   let actualWeekDays = parseInt((row.projectActualDays / 7) * 2)
      //   let plannedWeekDays = parseInt((row.projectPlannedDays / 7) * 2);
      //   obj[programId].programActualDays += row.projectActualDays - actualWeekDays;
      //   obj[programId].programPlannedDays += row.projectPlannedDays - plannedWeekDays;
      //   array[i].projectActualDays = row.projectActualDays - actualWeekDays;
      //   array[i].projectPlannedDays = row.projectPlannedDays - plannedWeekDays;
      //   return obj;
      // }, {});

      let portfolioSchedule = projectsSchedule.reduce((obj, row, i, array) => {
        if (!obj[portfolioId]) obj[portfolioId] = { portfolioActualDays: 0, portfolioPlannedDays: 0 };
        let actualWeekDays = parseInt((row.projectActualDays / 7) * 2)
        let plannedWeekDays = parseInt((row.projectPlannedDays / 7) * 2);
        obj[portfolioId].portfolioActualDays += row.projectActualDays - actualWeekDays;
        obj[portfolioId].portfolioPlannedDays += row.projectPlannedDays - plannedWeekDays;
        array[i].projectActualDays = row.projectActualDays - actualWeekDays;
        array[i].projectPlannedDays = row.projectPlannedDays - plannedWeekDays;
        return obj;
      }, {});

      let programsSchedule = projectsSchedule.reduce((obj, row) => {
        let prop = programMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = { programActualDays: 0, programPlannedDays: 0 };
        obj[prop].programActualDays += row.projectActualDays;
        obj[prop].programPlannedDays += row.projectPlannedDays;
        return obj;
      }, {});



      let monthwisePlanned = await taskModel.aggregate([{
        $match: { project: { $in: projects }, workPackage: true }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$plannedEndDate" } },
          firstDate: { $first: "$plannedEndDate" },
          lastDate: { $last: "$plannedEndDate" },
          plannedCost: { $sum: "$plannedCost" },
          plannedCompletion: { $sum: "$weightage" },
          actualCompletion: { $sum: { $divide: [{ $multiply: ["$weightage", "$completed"] }, 100] } },
        }
      },
      {
        $sort: { "_id": 1 }
      }]);


      let monthwiseActual = await monitoringModel.aggregate([{
        $match: { project: { $in: projects } }
      }, {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$monitoringDate" } },
          actualCost: { $sum: "$actualCost" },
          lastDate: { $last: "$monitoringDate" },
        }
      },
      {
        $sort: { "_id": 1 }
      }]);


      let monthList = createMonthlyArray(monthwisePlanned[0].firstDate, undefined, config)
      let monthwiseData = _.values(_.merge(_.keyBy(monthList, '_id'), _.keyBy(monthwisePlanned, '_id'), _.keyBy(monthwiseActual, '_id')));
      monthwiseData = monthwiseData.sort((a, b) => new Date(a._id) < new Date(b._id) ? -1 : 1)
      monthwiseData[monthwiseActual.length - 1].isLastMonitoring = true;
      monthwiseData.forEach((doc, i, docs) => {
        if (!doc.plannedCost) doc.plannedCost = 0;
        if (!doc.plannedCompletion) doc.plannedCompletion = 0;
        if (!doc.cumulativePlannedCost) doc.cumulativePlannedCost = 0;
        if (!doc.actualCompletion) doc.actualCompletion = 0;
        if (!doc.cumulativeActualCompletion) doc.cumulativeActualCompletion = 0;
        let previous = docs[i - 1];
        doc.cumulativePlannedCost = previous ? doc.plannedCost + previous.cumulativePlannedCost : doc.plannedCost;
        doc.cumulativePlannedCompletion = previous ? doc.plannedCompletion + previous.cumulativePlannedCompletion : doc.plannedCompletion;
        doc.cumulativeActualCompletion = previous ? doc.actualCompletion + previous.cumulativeActualCompletion : doc.actualCompletion;
        doc.cumulativeActualCost = previous ? doc.actualCost + previous.cumulativeActualCost : doc.actualCost || 0;
      });
      monthwiseData.forEach((doc, i, docs) => {
        let previous = docs[i - 1], final = docs[docs.length - 1];
        if (!doc.cumulativePlannedValue) doc.cumulativePlannedValue = 0;
        if (!doc.cumulativeEarnedValue) doc.cumulativeEarnedValue = 0;
        doc.cumulativePlannedValue = previous ? previous.cumulativePlannedValue + (doc.plannedCompletion * final.cumulativePlannedCost) : doc.plannedCompletion * (final.cumulativePlannedCost ? final.cumulativePlannedCost : 0);
        doc.cumulativeEarnedValue = previous ? previous.cumulativeEarnedValue + (doc.actualCompletion * final.cumulativePlannedCost) : doc.actualCompletion * (final.cumulativePlannedCost ? final.cumulativePlannedCost : 0);
      });

      let D = [], A = [monthwiseData[0].cumulativeActualCost], T = [0];

      monthwiseData.forEach((doc, i, docs) => {
        D.push(doc.actualCost);
        doc.FV = i > 0 ? docs[i - 1].FV + getFt(i, D, A, T) : 0;
        // 
      });

      let currentMonthRow = monthwiseData.find(d => {
        let y = startOfMonth(new Date(d._id)).valueOf() == startOfMonth(new Date()).valueOf()
        return y;
      });

      let actualCost = currentMonthRow ? currentMonthRow.cumulativeActualCost : 0;
      let currentMonthActualCost = currentMonthRow ? currentMonthRow.actualCost : 0;
      let currentMonthplannedCost = currentMonthRow ? currentMonthRow.plannedCost : 0;




      let budAtComp = monthwiseData[monthwiseData.length - 1].cumulativePlannedCost;
      let averageMonthlyCost = budAtComp / monthwiseData.length;
      let totalPlannedDays = portfolioSchedule[portfolioId].portfolioPlannedDays;
      let actualDaysSinceExecution = portfolioSchedule[portfolioId].portfolioActualDays;
      let performanceData = {
        PerformanceCostData: {
          ActualCost: currentMonthActualCost, // actual cost for the current month
          AverageMonthlyCost: currentMonthplannedCost, // total cost divided by the total budget
          PurpleRange: [0, currentMonthplannedCost],
          YellowRange: [currentMonthplannedCost, currentMonthplannedCost * 1.25],
          RedRange: [currentMonthplannedCost * 1.25, currentMonthplannedCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0], // plus management reserve
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


      let data = {
        allPrograms,
        monthwiseData,
        programCostAndCompletion,
        allProjects,
        performanceData,
        projectsSchedule,
        programsSchedule,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        allWPTasks
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  programsByPortfolioId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var portfolio = ObjectId(req.params.id);
      var allPrograms = await programModel.find({ portfolio }, { _id: 1, name: 1 }).lean();

      var programs = allPrograms.map((d) => d._id);
      var projects = (await projectModel.find({ program: { $in: programs } }, { _id: 1 }).lean()).map((d) => d._id);
      let allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, name: 1, program: 1 }).populate('program', 'name').lean();

      let programMap = allProjects.reduce((ob, project) => {
        ob[project._id] = project.program._id.toString();
        return ob;
      }, {})


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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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


      let portfolioTotal = 0;
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
        if (!obj[prop]) obj[prop] = { actual: 0, planned: 0, completion: 0 };
        obj[prop].actual += row.actual;
        obj[prop].planned += row.planned;
        obj[prop].completion += row.completion;
        portfolioTotal += row.planned;
        return obj;
      }, {});

      for (let key in programCostAndCompletion) {
        programCostAndCompletion[key].weightage = programCostAndCompletion[key].planned / portfolioTotal;
      }



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

      let programsSchedule = projectsSchedule.reduce((obj, row) => {
        let prop = programMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = { programActualDays: 0, programPlannedDays: 0 };
        obj[prop].programActualDays += row.projectActualDays;
        obj[prop].programPlannedDays += row.projectPlannedDays;
        return obj;
      }, {});



      let data = {
        allPrograms,
        programCostAndCompletion,
        programsSchedule,
        plannedResourceBreakup,
        plannedLaborBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  portfoliosByManagerId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {

      var allPortfolios = await portfolioModel.find({}, { _id: 1, name: 1 }).lean();
      var portfolios = allPortfolios.map((d) => d._id);
      var allPrograms = await programModel.find({ portfolio: { $in: portfolios } }, { _id: 1, portfolio: 1 }).lean();
      var programs = [];
      let programToPortfolioMap = allPrograms.reduce((ob, program) => {
        ob[program._id] = program.portfolio.toString();
        programs.push(program._id);
        return ob;
      }, {})

      var projects = []
      var allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, program: 1 }).lean();

      let portfolioByProjectMap = allProjects.reduce((ob, project) => {
        ob[project._id] = programToPortfolioMap[project.program.toString()];
        projects.push(project._id);
        return ob;
      }, {})


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
        let prop = portfolioByProjectMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        let prop = portfolioByProjectMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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
        let prop = portfolioByProjectMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = 0;
        obj[prop] += row.total;
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


      let portfolioTotal = 0;
      let portfolioCostAndCompletion = (await taskModel.aggregate([
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
        let prop = portfolioByProjectMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = { actual: 0, planned: 0, completion: 0 };
        obj[prop].actual += row.actual;
        obj[prop].planned += row.planned;
        obj[prop].completion += row.completion;
        portfolioTotal += row.planned;
        return obj;
      }, {});

      for (let key in portfolioCostAndCompletion) {
        portfolioCostAndCompletion[key].weightage = portfolioCostAndCompletion[key].planned / portfolioTotal;
      }

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



      let portfoliosSchedule = projectsSchedule.reduce((obj, row) => {
        let prop = portfolioByProjectMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = { portfolioActualDays: 0, portfolioPlannedDays: 0 };
        obj[prop].portfolioActualDays += row.projectActualDays;
        obj[prop].portfolioPlannedDays += row.projectPlannedDays;
        return obj;
      }, {});



      let data = {
        allPortfolios,
        portfolioCostAndCompletion,
        portfoliosSchedule,
        plannedResourceBreakup,
        plannedLaborBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  portfolioGovernance: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var allPortfolios = await portfolioModel.find({}, { _id: 1, name: 1 }).lean();
      var portfolios = allPortfolios.map((d) => d._id);
      var allPrograms = await programModel.find({ portfolio: { $in: portfolios } }, { _id: 1, name: 1, portfolio: 1 }).populate('portfolio', 'name').lean();
      let portfolioMap = allPrograms.reduce((ob, program) => {
        ob[program._id] = program.portfolio._id.toString();
        return ob;
      }, {})
      var programs = allPrograms.map((d) => d._id);
      let allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, name: 1, program: 1 }).populate('program', 'name').lean();
      var projects = allProjects.map((d) => d._id);
      let programMap = allProjects.reduce((ob, project) => {
        ob[project._id] = project.program._id.toString();
        return ob;
      }, {})

      allPortfolios = allPrograms.reduce((obj, row) => {
        let prop = row.portfolio._id;
        if (!obj[prop]) obj[prop] = { name: row.portfolio.name, programs: [] };
        obj[prop].programs.push({ _id: row._id.toString(), name: row.name });
        return obj;
      }, {});


      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate([{
        $match: {
          $and: [
            { project: { $in: projects } },
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
        let programId = programMap[row._id.toString()];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = {};
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = 0;
        obj[portfolioId][programId] += row.total;
        return obj;
      }, {});


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
        let programId = programMap[row._id.toString()];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = {};
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = 0;
        obj[portfolioId][programId] += row.total;
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
        let programId = programMap[row._id.toString()];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = {};
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = 0;
        obj[portfolioId][programId] += row.total;
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
        let programId = programMap[row._id.toString()];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = {};
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = 0;
        obj[portfolioId][programId] += row.total;
        return obj;
      }, {});


      let projectsCost = (await projectModel.find({ _id: { $in: projects } }, { totalEstimatedBudget: 1 }).sort({ plannedStartDate: 1 }).lean())
        .reduce((obj, row) => {
          obj[row._id.toString()] = row.totalEstimatedBudget ? row.totalEstimatedBudget : 0;
          return obj;
        }, {});
      let projectsActualCostAndCompletion = (await taskModel.aggregate([
        { $sort: { plannedStartDate: 1 } },
        { $match: { project: { $in: projects }, workPackage: true } },
        {
          $group: {
            _id: "$project",
            actual: { $sum: '$actualCost' },
            completion: { $sum: { $multiply: ['$weightage', '$completed'] } }
          }
        }
      ])).reduce((obj, row) => {
        obj[row._id.toString()] = { actual: row.actual ? row.actual : 0, completion: row.completion ? row.completion : 0 };
        return obj;
      }, {});




      let portfolioCostAndCompletion = Object.keys(projectsCost).reduce((obj, projectId) => {
        let programId = programMap[projectId];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = { totalPlanned: 0 };
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = { actual: 0, planned: 0, completion: 0 };
        obj[portfolioId][programId].actual += projectsActualCostAndCompletion[projectId] ? projectsActualCostAndCompletion[projectId].actual : 0;
        obj[portfolioId][programId].planned += projectsCost[projectId];
        obj[portfolioId].totalPlanned += projectsCost[projectId];
        return obj;
      }, {});


      Object.keys(projectsCost).forEach((projectId) => {
        let programId = programMap[projectId];
        let portfolioId = portfolioMap[programId];
        portfolioCostAndCompletion[portfolioId][programId].completion += (projectsCost[projectId] / portfolioCostAndCompletion[portfolioId].totalPlanned) * (projectsActualCostAndCompletion[projectId] ? projectsActualCostAndCompletion[projectId].completion : 0);
      });

      let projectsSchedule = await projectModel.aggregate([{
        $match: { program: { $in: programs } },
      }, {
        $project: {
          plannedDays: { $divide: [{ $subtract: ["$expectedEndDate", "$expectedStartDate"] }, 864e5] },
          actualDays: {
            $divide: [{
              $subtract: [{
                $cond: {
                  if: { $eq: ["$completed", 100] }, then: "$lastMonitoringDate", else: {
                    $cond: { if: { $lt: [new Date(), "$expectedStartDate"] }, then: "$expectedStartDate", else: new Date() }
                  }
                }
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

      let portfoliosSchedule = projectsSchedule.reduce((obj, row) => {
        let programId = programMap[row._id.toString()];
        let portfolioId = portfolioMap[programId];
        if (!obj[portfolioId]) obj[portfolioId] = {};
        if (!obj[portfolioId][programId]) obj[portfolioId][programId] = { projectActualDays: 0, projectPlannedDays: 0 };
        obj[portfolioId][programId].projectActualDays += row.projectActualDays;
        obj[portfolioId][programId].projectPlannedDays += row.projectPlannedDays;
        return obj;
      }, {});

      let data = {
        allPrograms,
        portfolioCostAndCompletion,
        allPortfolios,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        projectsSchedule,
        portfoliosSchedule
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  programGovernance: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var portfolio = ObjectId(req.params.id);
      var allPrograms = await programModel.find({ portfolio }, { _id: 1, name: 1 }).lean();
      var programs = allPrograms.map((d) => d._id);

      let allProjects = await projectModel.find({ program: { $in: programs } }, { _id: 1, name: 1, program: 1 }).populate('program', 'name').lean();
      var projects = allProjects.map((d) => d._id);
      let programMap = allProjects.reduce((ob, project) => {
        ob[project._id] = project.program._id.toString();
        return ob;
      }, {})

      allPrograms = allProjects.reduce((obj, row) => {
        let prop = row.program._id;
        if (!obj[prop]) obj[prop] = { name: row.program.name, projects: [] };
        obj[prop].projects.push({ _id: row._id.toString(), name: row.name });
        return obj;
      }, {});


      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate([{
        $match: {
          $and: [
            { project: { $in: projects } },
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
      /*
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
      */
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

      let projectsCost = (await projectModel.find({ _id: { $in: projects } }, { totalEstimatedBudget: 1 }).sort({ plannedStartDate: 1 }).lean())
        .reduce((obj, row) => {
          obj[row._id.toString()] = row.totalEstimatedBudget ? row.totalEstimatedBudget : 0;
          return obj;
        }, {});
      let _programCostAndCompletion = (await taskModel.aggregate([
        { $sort: { plannedStartDate: 1 } },
        { $match: { project: { $in: projects }, workPackage: true } },
        {
          $group: {
            _id: "$project",
            actual: { $sum: '$actualCost' },

            // planned: { $sum: '$plannedCost' },
            completion: { $sum: { $multiply: ['$weightage', '$completed'] } }
          }
        }
      ])).reduce((obj, row) => {
        obj[row._id.toString()] = { actual: row.actual ? row.actual : 0, completion: row.completion ? row.completion : 0 };
        return obj;
      }, {});
      let programCostAndCompletion = Object.keys(projectsCost).reduce((obj, projectId) => {
        let programId = programMap[projectId];
        if (!obj[programId]) obj[programId] = {};
        obj[programId][projectId] = { actual: _programCostAndCompletion[projectId] ? _programCostAndCompletion[projectId].actual : 0, planned: projectsCost[projectId], completion: _programCostAndCompletion[projectId] ? _programCostAndCompletion[projectId].completion : 0 }
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
                $cond: {
                  if: { $eq: ["$completed", 100] }, then: "$lastMonitoringDate", else: {
                    $cond: { if: { $lt: [new Date(), "$expectedStartDate"] }, then: "$expectedStartDate", else: new Date() }
                  }
                }
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

      let programsSchedule = projectsSchedule.reduce((obj, row) => {
        let prop = programMap[row._id.toString()];
        if (!obj[prop]) obj[prop] = {};
        obj[prop][row._id.toString()] = { projectActualDays: row.projectActualDays, projectPlannedDays: row.projectPlannedDays }
        return obj;
      }, {});

      let data = {
        allPrograms,
        programCostAndCompletion,
        allProjects,
        actualResourceBreakup,
        plannedResourceBreakup,
        // actualLaborBreakup,
        // plannedLaborBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        projectsSchedule,
        programsSchedule
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  gisDashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

      let allWPTasks = await taskModel
        .find({ project, workPackage: true })
        .populate('projectLocation', 'pathId')
        .populate('lastMonitoring', 'files')
        .sort({ plannedStartDate: 1 })
        .lean();
      let lastPlannedDate = new Date(0);
      let weightageMap = allWPTasks.reduce((map, task) => {
        map[task.taskId] = task.weightage;
        if (lastPlannedDate < task.plannedEndDate) lastPlannedDate = new Date(task.plannedEndDate);
        return map;
      }, {});
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }

      let tasks = allWPTasks;
      let prev = null;



      let lastMonitoredMonth;



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

      if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date() });
      let lastMonitoringIndex = monitoringsCost.length - 1;
      let isSameDate = false;


      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);


      let result = await (await taskPlannedResourceModel.find({ project }).populate("task", ["plannedStartDate", "plannedEndDate"]).lean()).filter(row => row.task.plannedEndDate <= new Date());


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
        let ref = monthlyLabor[month];
        if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
        else {
          monthlyLabor[month].actual.total += total;
          monthlyLabor[month].actual.qty += days;
        }
      })

      let lastOfMonitorings = monitorings.reduce((pre, cur, i) => {
        if (!monitorings[i + 1] || monitorings[i]._doc.task.id != monitorings[i + 1]._doc.task.id) {
          pre.push(cur);
          return pre;
        }
        return pre;
      }, []);

      let data = {
        monitorings,
        lastOfMonitorings,
        tasks,
        completionDate,
        monitoringsCost,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  evmDashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

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
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }


      let tasks = allWPTasks;
      let prev = null;

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


      let lastMonitoredMonth;



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

      let datewiseActualBreakup, lastMonitoringIndex;
      monitoringsCost = await monitoringModel.aggregate(query);
      if (monitoringsCost.length > 0) {
        datewiseActualBreakup = monitoringsCost.map(m => ({ date: m._id, actualCost: 0, actualCompletion: 0, cumulativeActualCompletion: 0, cumulativeActualCost: 0 }));
        // if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date(), actualCost: 0, monitoringWeight: 0 });
        lastMonitoringIndex = monitoringsCost.length - 1;
        let isSameDate = false;
        monitoringsCost.forEach((monitoring, i) => {
          datewiseActualBreakup[i].actualCost += monitoring.actualCost;
          datewiseActualBreakup[i].actualCompletion += monitoring.monitoringWeight;
          datewiseActualBreakup[i].cumulativeActualCost = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCost : 0) + datewiseActualBreakup[i].actualCost;
          datewiseActualBreakup[i].cumulativeActualCompletion = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCompletion : 0) + datewiseActualBreakup[i].actualCompletion;
        })
      }



      let EVMValuesPerMonth = [];
      let budAtComp = datewiseBreakup[datewiseBreakup.length - 1].cumulativePlannedCost;
      datewiseBreakup.forEach((breakup, i) => {
        EVMValuesPerMonth.push({
          RecordDate: breakup.date,
          PV: breakup.cumulativePlannedCost,
        });
      })
      let EVMValuesPerMonth2 = [];
      let lastEVM;
      if (datewiseActualBreakup) {


        let D = [datewiseActualBreakup[0].actualCost];
        let A = [D[0]],
          T = [0];

        datewiseActualBreakup.forEach((breakup, i) => {
          D.push(breakup.cumulativeActualCost);
          datewiseActualBreakup[i].cumulativeEarnedValue = datewiseActualBreakup[i].cumulativeActualCompletion * budAtComp;
          EVMValuesPerMonth2.push({
            RecordDate: breakup.date,
            LastMonitoring: lastMonitoringIndex == i,
            AC: breakup.cumulativeActualCost,
            EV: breakup.cumulativeEarnedValue,
          });
        })
        lastEVM = EVMValuesPerMonth2[EVMValuesPerMonth2.length - 1];
      } else datewiseActualBreakup = [{ actualCost: 0 }];

      // let todayIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == (new Date()).toLocaleDateString());
      let plannedIndex = monitoringsCost.length > 0 ? datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == monitoringsCost[lastMonitoringIndex]._id.toLocaleDateString()) : 0;
      let plannedValue = datewiseBreakup[plannedIndex].cumulativePlannedCost;
      let earnedValue = lastMonitoringIndex ? datewiseActualBreakup[lastMonitoringIndex].cumulativeEarnedValue : 0;
      let actualCost = lastMonitoringIndex ? datewiseActualBreakup[lastMonitoringIndex].cumulativeActualCost : 0;

      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;

      let costVariance = Math.round((earnedValue - actualCost) * 10) / 10;
      let scheduleVariance = earnedValue != 0 ? (Math.round((earnedValue - plannedValue) * 10) / 10) : 0;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = 'On Schedule';
      if (scheduleVariance > 0) scheduleStatus = 'Ahead of schedule';
      else if (scheduleVariance < 0) scheduleStatus = 'Behind schedule';
      let costStatus = 'On budget';
      if (costVariance > 0) costStatus = 'Under budget';
      if (costVariance < 0) costStatus = 'Over budget';
      let CPI = actualCost ? earnedValue / actualCost : 0;
      let SPI = earnedValue / plannedValue;
      let estimateAtCompletion = actualCost ? (actualCost + (budAtComp - earnedValue) / (SPI * CPI)) : budAtComp;
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      let voc_actual = actualCost / budAtComp;
      let voc_estimated = actualCost / estimateAtCompletion;
      let acv = estimateAtCompletion / budAtComp;
      if (Math.abs(varianceAtCompletion) < 500) varianceAtCompletion = 0;
      v = estimateAtCompletion - actualCost;
      let TCPI = (actualCost && budAtComp != earnedValue) ? (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) : 0;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);

      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];


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
      // result = await taskUtilizedResourceModel.find({project, boqType: 1}).populate('task',['plannedCostPerDay','actualStartDate']).lean()
      result.forEach((row, i) => {
        let month = new Date(row._id.month);
        let fromDate = row.task[0].actualStartDate;
        if (result[i - 1] && result[i - 1].task.toString() == row._id.task.toString()) fromDate = result[i - 1].monitoringDate;
        let days = differenceInDays(row.monitoringDate, fromDate);
        let total = row.total;
        let ref = monthlyLabor[month];
        if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
        else {
          monthlyLabor[month].actual.total += total;
          monthlyLabor[month].actual.qty += days;
        }
      })

      let data = {
        monitorings,
        estimateAtCompletion,
        TCPI,
        scheduleVarianceInDays,
        scheduleVariance,
        scheduleStatus,
        costVariance,
        costStatus,
        CPI,
        SPI,
        voc_actual,
        voc_estimated,
        acv,
        varianceAtCompletion,
        budAtComp,
        tasks,
        completionDate,
        monitoringsCost,
        EVMValuesPerMonth,
        EVMValuesPerMonth2,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  forecastDashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

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
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }


      let tasks = allWPTasks;
      let prev = null;

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


      let lastMonitoredMonth;



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

      let datewiseActualBreakup, lastMonitoringIndex;
      monitoringsCost = await monitoringModel.aggregate(query);
      if (monitoringsCost.length > 0) {
        datewiseActualBreakup = monitoringsCost.map(m => ({ date: m._id, actualCost: 0, actualCompletion: 0, cumulativeActualCompletion: 0, cumulativeActualCost: 0 }));
        // if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date(), actualCost: 0, monitoringWeight: 0 });
        lastMonitoringIndex = monitoringsCost.length - 1;
        let isSameDate = false;
        monitoringsCost.forEach((monitoring, i) => {
          datewiseActualBreakup[i].actualCost += monitoring.actualCost;
          datewiseActualBreakup[i].actualCompletion += monitoring.monitoringWeight;
          datewiseActualBreakup[i].cumulativeActualCost = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCost : 0) + datewiseActualBreakup[i].actualCost;
          datewiseActualBreakup[i].cumulativeActualCompletion = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCompletion : 0) + datewiseActualBreakup[i].actualCompletion;
        })
      }


      let EVMValuesPerMonth2 = [];
      datewiseActualBreakup.forEach((breakup, i) => {
        D.push(breakup.cumulativeActualCost);
        datewiseActualBreakup[i].cumulativeEarnedValue = datewiseActualBreakup[i].cumulativeActualCompletion * budAtComp;
        EVMValuesPerMonth2.push({
          RecordDate: breakup.date,
          LastMonitoring: lastMonitoringIndex == i,
          AC: breakup.cumulativeActualCost,
          EV: breakup.cumulativeEarnedValue,
          FV: i > 0 ? EVMValuesPerMonth2[i - 1].FV + getFt(i, D, A, T) : 0
        });
      })
      let lastEVM = EVMValuesPerMonth2[EVMValuesPerMonth2.length - 1];
      EVMValuesPerMonth2.push({
        RecordDate: endOfMonth(addMonths(lastEVM.RecordDate, 1)),
        LastMonitoring: true,
        FV: lastEVM.FV + getFt(EVMValuesPerMonth2.length - 1, D, A, T)
      });

      // let todayIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == (new Date()).toLocaleDateString());
      let plannedIndex = monitoringsCost.length > 0 ? datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == monitoringsCost[lastMonitoringIndex]._id.toLocaleDateString()) : 0;
      let plannedValue = datewiseBreakup[plannedIndex].cumulativePlannedCost;
      let earnedValue = lastMonitoringIndex ? datewiseActualBreakup[lastMonitoringIndex].cumulativeEarnedValue : 0;
      let actualCost = lastMonitoringIndex ? datewiseActualBreakup[lastMonitoringIndex].cumulativeActualCost : 0;

      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;

      let costVariance = Math.round((earnedValue - actualCost) * 10) / 10;
      let scheduleVariance = Math.round((earnedValue - plannedValue) * 10) / 10;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = 'On Schedule';
      if (scheduleVariance > 0) scheduleStatus = 'Ahead of schedule';
      else if (scheduleVariance < 0) scheduleStatus = 'Behind schedule';
      let costStatus = 'On budget';
      if (costVariance > 0) costStatus = 'Under budget';
      if (costVariance < 0) costStatus = 'Over budget';
      let CPI = actualCost ? earnedValue / actualCost : 0;
      let SPI = earnedValue / plannedValue;
      let estimateAtCompletion = actualCost ? (actualCost + (budAtComp - earnedValue) / (SPI * CPI)) : budAtComp;
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      let voc_actual = actualCost / budAtComp;
      let voc_estimated = actualCost / estimateAtCompletion;
      let acv = estimateAtCompletion / budAtComp;
      if (Math.abs(varianceAtCompletion) < 500) varianceAtCompletion = 0;
      v = estimateAtCompletion - actualCost;
      let TCPI = (actualCost && budAtComp != earnedValue) ? (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) : 0;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);


      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];


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
      // result = await taskUtilizedResourceModel.find({project, boqType: 1}).populate('task',['plannedCostPerDay','actualStartDate']).lean()
      result.forEach((row, i) => {
        let month = new Date(row._id.month);
        let fromDate = row.task[0].actualStartDate;
        if (result[i - 1] && result[i - 1].task.toString() == row._id.task.toString()) fromDate = result[i - 1].monitoringDate;
        let days = differenceInDays(row.monitoringDate, fromDate);
        let total = row.total;
        let ref = monthlyLabor[month];
        if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
        else {
          monthlyLabor[month].actual.total += total;
          monthlyLabor[month].actual.qty += days;
        }
      })

      let data = {
        monitorings,
        estimateAtCompletion,
        TCPI,
        scheduleVarianceInDays,
        scheduleVariance,
        scheduleStatus,
        costVariance,
        costStatus,
        CPI,
        SPI,
        voc_actual,
        voc_estimated,
        acv,
        varianceAtCompletion,
        budAtComp,
        tasks,
        completionDate,
        monitoringsCost,
        EVMValuesPerMonth,
        EVMValuesPerMonth2,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  forecast1DashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

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
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }


      let tasks = allWPTasks;
      let prev = null;

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


      let lastMonitoredMonth;



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
      if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date() });
      let lastMonitoringIndex = monitoringsCost.length - 1;
      let isSameDate = false;
      monitoringsCost.forEach((monitoring, i) => {
        datewiseActualBreakup[i].actualCost += monitoring.actualCost;
        datewiseActualBreakup[i].actualCompletion += monitoring.monitoringWeight;
        datewiseActualBreakup[i].cumulativeActualCost = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCost : 0) + datewiseActualBreakup[i].actualCost;
        datewiseActualBreakup[i].cumulativeActualCompletion = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCompletion : 0) + datewiseActualBreakup[i].actualCompletion;
      })

      let D = [datewiseActualBreakup[0].actualCost];
      let A = [D[0]],
        T = [0];

      let EVMValuesPerMonth = [];
      let budAtComp = datewiseBreakup[datewiseBreakup.length - 1].cumulativePlannedCost;
      datewiseBreakup.forEach((breakup, i) => {
        EVMValuesPerMonth.push({
          RecordDate: breakup.date,
          PV: breakup.cumulativePlannedCost,
        });
      })
      let EVMValuesPerMonth2 = [];

      datewiseActualBreakup.forEach((breakup, i) => {
        D.push(breakup.cumulativeActualCost);
        datewiseActualBreakup[i].cumulativeEarnedValue = datewiseActualBreakup[i].cumulativeActualCompletion * budAtComp;
        EVMValuesPerMonth2.push({
          RecordDate: breakup.date,
          LastMonitoring: lastMonitoringIndex == i,
          AC: breakup.cumulativeActualCost,
          EV: breakup.cumulativeEarnedValue,
          FV: i > 0 ? EVMValuesPerMonth2[i - 1].FV + getFt(i, D, A, T) : 0
        });
      })
      let lastEVM = EVMValuesPerMonth2[EVMValuesPerMonth2.length - 1];
      EVMValuesPerMonth2.push({
        RecordDate: endOfMonth(addMonths(lastEVM.RecordDate, 1)),
        LastMonitoring: true,
        FV: lastEVM.FV + getFt(EVMValuesPerMonth2.length - 1, D, A, T)
      });
      // let todayIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == (new Date()).toLocaleDateString());
      let plannedIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == monitoringsCost[lastMonitoringIndex]._id.toLocaleDateString());
      let plannedValue = datewiseBreakup[plannedIndex].cumulativePlannedCost;
      let earnedValue = datewiseActualBreakup[lastMonitoringIndex].cumulativeEarnedValue;
      let actualCost = datewiseActualBreakup[lastMonitoringIndex].cumulativeActualCost;

      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;

      let costVariance = Math.round((earnedValue - actualCost) * 10) / 10;
      let scheduleVariance = Math.round((earnedValue - plannedValue) * 10) / 10;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = 'On Schedule';
      if (scheduleVariance > 0) scheduleStatus = 'Ahead of schedule';
      else if (scheduleVariance < 0) scheduleStatus = 'Behind schedule';
      let costStatus = 'On budget';
      if (costVariance > 0) costStatus = 'Under budget';
      if (costVariance < 0) costStatus = 'Over budget';
      let CPI = earnedValue / actualCost;
      let SPI = earnedValue / plannedValue;
      let estimateAtCompletion = actualCost + (budAtComp - earnedValue) / (SPI * CPI);
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      let voc_actual = actualCost / budAtComp;
      let voc_estimated = actualCost / estimateAtCompletion;
      let acv = estimateAtCompletion / budAtComp;
      if (Math.abs(varianceAtCompletion) < 500) varianceAtCompletion = 0;
      v = estimateAtCompletion - actualCost;
      let TCPI = budAtComp != earnedValue ? (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) : 0;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);


      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];


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
      // result = await taskUtilizedResourceModel.find({project, boqType: 1}).populate('task',['plannedCostPerDay','actualStartDate']).lean()
      result.forEach((row, i) => {
        let month = new Date(row._id.month);
        let fromDate = row.task[0].actualStartDate;
        if (result[i - 1] && result[i - 1].task.toString() == row._id.task.toString()) fromDate = result[i - 1].monitoringDate;
        let days = differenceInDays(row.monitoringDate, fromDate);
        let total = row.total;
        let ref = monthlyLabor[month];
        if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
        else {
          monthlyLabor[month].actual.total += total;
          monthlyLabor[month].actual.qty += days;
        }
      })

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
        voc_actual,
        voc_estimated,
        acv,
        varianceAtCompletion,
        budAtComp,
        tasks,
        completionDate,
        monitoringsCost,
        monthlyLaborData,
        EVMValuesPerMonth,
        EVMValuesPerMonth2,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  kpiDashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

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
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, plannedStartDate: { $ne: null }, workPackage: true })
        .sort({ plannedStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }

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

      // if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date() });
      let lastMonitoringIndex = monitoringsCost.length - 1;
      let plannedIndex = monitoringsCost.length ? datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == monitoringsCost[lastMonitoringIndex]._id.toLocaleDateString()) : 0;
      let budAtComp = datewiseBreakup[datewiseBreakup.length - 1].cumulativePlannedCost;
      let plannedValue = datewiseBreakup[plannedIndex].cumulativePlannedCost;
      let earnedValue = datewiseActualBreakup.length ? datewiseActualBreakup[lastMonitoringIndex].cumulativeEarnedValue : 0;
      let actualCost = datewiseActualBreakup.length ? datewiseActualBreakup[lastMonitoringIndex].cumulativeActualCost : 0;
      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;


      currentMonthPlannedCost = datewiseBreakup.reduce((monthPlannedCost, row) => {
        if (row.date.getMonth() == (new Date()).getMonth() && row.date.getFullYear() == (new Date()).getFullYear()) return (monthPlannedCost + row.plannedCost);
        else return monthPlannedCost;
      }, 0)



      let CPI = earnedValue ? earnedValue / actualCost : 0;
      let SPI = earnedValue ? earnedValue / plannedValue : 0;




      // let currentMonthRow = monthwiseData.find(d => {
      //   let y = startOfMonth(new Date(d._id)).valueOf() == startOfMonth(new Date()).valueOf()
      //   return y;
      // });

      // let actualCost = currentMonthRow ? currentMonthRow.cumulativeActualCost : 0;
      // let currentMonthActualCost = currentMonthRow ? currentMonthRow.actualCost : 0;
      // let currentMonthPlannedCost = currentMonthRow ? currentMonthRow.plannedCost : 0;
      // let budAtComp = monthwiseData[monthwiseData.length - 1].cumulativePlannedCost;
      // let averageMonthlyCost = budAtComp / monthwiseData.length;



      let estimateAtCompletion = (SPI * CPI) != 0 ? actualCost + (budAtComp - earnedValue) / (SPI * CPI) : budAtComp;
      let voc_actual = actualCost / budAtComp;
      let voc_estimated = actualCost / estimateAtCompletion;
      let acv = estimateAtCompletion / budAtComp;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.plannedStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);
      let performanceData = {
        PerformanceCostData: {
          ActualCost: currentMonthActualCost, // actual cost for the current month
          AverageMonthlyCost: currentMonthPlannedCost, // total cost divided by the total budget
          PurpleRange: [0, currentMonthPlannedCost],
          YellowRange: [currentMonthPlannedCost, currentMonthPlannedCost * 1.25],
          RedRange: [currentMonthPlannedCost * 1.25, currentMonthPlannedCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0], // plus management reserve
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

      let data = {
        performanceData,
        voc_actual,
        voc_estimated,
        acv
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  dashboardByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

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
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['description', 'plannedCost', 'actualCost', 'projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }


      let tasks = allWPTasks;
      let prev = null;

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


      let lastMonitoredMonth;



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
      if (monitoringsCost.length == 0) monitoringsCost.push({ date: new Date() });
      let lastMonitoringIndex = monitoringsCost.length - 1;
      let isSameDate = false;
      monitoringsCost.forEach((monitoring, i) => {
        datewiseActualBreakup[i].actualCost += monitoring.actualCost;
        // datewiseActualBreakup[i].actualCompletion += weightageMap[monitoring.taskId] * (monitoring.completionVariance * 0.01);
        datewiseActualBreakup[i].actualCompletion += monitoring.monitoringWeight;
        datewiseActualBreakup[i].cumulativeActualCost = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCost : 0) + datewiseActualBreakup[i].actualCost;
        datewiseActualBreakup[i].cumulativeActualCompletion = (i > 0 ? datewiseActualBreakup[i - 1].cumulativeActualCompletion : 0) + datewiseActualBreakup[i].actualCompletion;
      })

      let D = [datewiseActualBreakup[0].actualCost];
      let A = [D[0]],
        T = [0];

      let EVMValuesPerMonth = [];
      let budAtComp = datewiseBreakup[datewiseBreakup.length - 1].cumulativePlannedCost;
      datewiseBreakup.forEach((breakup, i) => {
        EVMValuesPerMonth.push({
          RecordDate: breakup.date,
          PV: breakup.cumulativePlannedCost,
        });
      })
      let EVMValuesPerMonth2 = [];

      datewiseActualBreakup.forEach((breakup, i) => {
        D.push(breakup.cumulativeActualCost);
        datewiseActualBreakup[i].cumulativeEarnedValue = datewiseActualBreakup[i].cumulativeActualCompletion * budAtComp;
        EVMValuesPerMonth2.push({
          RecordDate: breakup.date,
          LastMonitoring: lastMonitoringIndex == i,
          AC: breakup.cumulativeActualCost,
          EV: breakup.cumulativeEarnedValue,
          FV: i > 0 ? EVMValuesPerMonth2[i - 1].FV + getFt(i, D, A, T) : 0
          // FV: monPlnBrk.monthly[key].cumPlnVal * 1.05
        });
      })
      let lastEVM = EVMValuesPerMonth2[EVMValuesPerMonth2.length - 1];
      EVMValuesPerMonth2.push({
        RecordDate: endOfMonth(addMonths(lastEVM.RecordDate, 1)),
        LastMonitoring: true,
        FV: lastEVM.FV + getFt(EVMValuesPerMonth2.length - 1, D, A, T)
      });
      // let todayIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == (new Date()).toLocaleDateString());
      let plannedIndex = datewiseBreakup.findIndex(breakup => breakup.date.toLocaleDateString() == monitoringsCost[lastMonitoringIndex]._id.toLocaleDateString());
      let plannedValue = datewiseBreakup[plannedIndex].cumulativePlannedCost;
      let earnedValue = datewiseActualBreakup[lastMonitoringIndex].cumulativeEarnedValue;
      let actualCost = datewiseActualBreakup[lastMonitoringIndex].cumulativeActualCost;

      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;

      let costVariance = Math.round((earnedValue - actualCost) * 10) / 10;
      let scheduleVariance = Math.round((earnedValue - plannedValue) * 10) / 10;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = 'On Schedule';
      if (scheduleVariance > 0) scheduleStatus = 'Ahead of schedule';
      else if (scheduleVariance < 0) scheduleStatus = 'Behind schedule';
      let costStatus = 'On budget';
      if (costVariance > 0) costStatus = 'Under budget';
      if (costVariance < 0) costStatus = 'Over budget';
      let CPI = earnedValue / actualCost;
      let SPI = earnedValue / plannedValue;
      let estimateAtCompletion = actualCost + (budAtComp - earnedValue) / (SPI * CPI);
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      let voc_actual = actualCost / budAtComp;
      let voc_estimated = actualCost / estimateAtCompletion;
      let acv = estimateAtCompletion / budAtComp;
      if (Math.abs(varianceAtCompletion) < 500) varianceAtCompletion = 0;
      v = estimateAtCompletion - actualCost;
      let TCPI = budAtComp != earnedValue ? (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) : 0;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);


      let performanceData = {

        PerformanceCostData: {
          ActualCost: currentMonthActualCost, // actual cost for the current month
          AverageMonthlyCost: currentMonthPlannedCost, // total cost divided by the total budget
          PurpleRange: [0, currentMonthPlannedCost],
          YellowRange: [currentMonthPlannedCost, currentMonthPlannedCost * 1.25],
          RedRange: [currentMonthPlannedCost * 1.25, currentMonthPlannedCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0], // plus management reserve
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
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskPlannedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let plannedResourceBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let actualLaborBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

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
      // result = await taskUtilizedResourceModel.find({project, boqType: 1}).populate('task',['plannedCostPerDay','actualStartDate']).lean()
      result.forEach((row, i) => {
        let month = new Date(row._id.month);
        let fromDate = row.task[0].actualStartDate;
        if (result[i - 1] && result[i - 1].task.toString() == row._id.task.toString()) fromDate = result[i - 1].monitoringDate;
        let days = differenceInDays(row.monitoringDate, fromDate);
        let total = row.total;
        let ref = monthlyLabor[month];
        if (!monthlyLabor[month] || !monthlyLabor[month].planned) monthlyLabor[month] = { planned: { total: 0, qty: 0 }, actual: { total, qty: days } };
        else {
          monthlyLabor[month].actual.total += total;
          monthlyLabor[month].actual.qty += days;
        }
      })

      let monthlyLaborData = Object.keys(monthlyLabor).sort((a, b) => a < b).map(key => ({ month: new Date(key), planned: monthlyLabor[key].planned, actual: monthlyLabor[key].actual }));
      monthlyLaborData = monthlyLaborData.filter(row => row.actual.total > 0);
      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
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
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualContractorEquipmentBreakup = (await taskUtilizedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let plannedContractorEquipmentBreakup = (await taskPlannedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});
      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { task: '$task', rankId: '$top3', material: '$description' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let consumableMaterialBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task][row._id.rankId] = {
          material: row._id.material,
          Planned: { qty: row.qty, total: row.total }
        };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { task: '$task', rankId: '$top3' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      // let consumableMaterialBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
      //   // if (!obj[row._id.task]) obj[row._id.task] = {};
      //   obj[row._id.task][row._id.rankId].Actual = {  qty: row.qty, total: row.total };
      //   return obj;
      // }, plannedConsumableMaterialBreakup);

      let utilizedResources = await taskUtilizedResourceModel.aggregate(query);
      utilizedResources.forEach((row) => {
        consumableMaterialBreakup[row._id.task][row._id.rankId].Actual = { qty: row.qty, total: row.total };
      });
      let lastOfMonitorings = monitorings.reduce((pre, cur, i) => {
        if (!monitorings[i + 1] || monitorings[i]._doc.task.id != monitorings[i + 1]._doc.task.id) {
          pre.push(cur);
          return pre;
        }
        return pre;
      }, [])
      let data = {
        monitorings,
        lastOfMonitorings,
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
        voc_actual,
        voc_estimated,
        acv,
        varianceAtCompletion,
        budAtComp,
        tasks,
        completionDate,
        monitoringsCost,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        monthlyLaborData,
        EVMValuesPerMonth,
        EVMValuesPerMonth2,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },



  wpVarianceByProjectId: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };

      let tasks = await taskModel
        .find({ project, workPackage: true })
        .populate('projectLocation', 'pathId')
        .sort({ plannedStartDate: 1 })
        .lean();


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

      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskPlannedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let plannedResourceBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let actualLaborBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

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


      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
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
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let actualContractorEquipmentBreakup = (await taskUtilizedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let plannedContractorEquipmentBreakup = (await taskPlannedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '4' }]
          }
        },
        {
          $group: {
            _id: { task: '$task', boq: "$boq" },
            total: { $sum: '$total' },
            qty: { $sum: '$quantity' }
          }
        },
        {
          $lookup: {
            from: "boqs",
            localField: "_id.boq",
            foreignField: "_id",
            as: "material"
          }
        },
      ];

      let consumableMaterialBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = [];
        obj[row._id.task].push({
          material: row.material[0].name,
          Planned: {
            qty: row.qty,
            total: row.total
          }
        });
        return obj;
      }, {});

      let data = {
        tasks,
        monitoringsCost,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  monthlyLaborByProjectId: async function (req, res) {
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
  dashboardByProjectIdold: async function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var project = ObjectId(req.params.id);
      let currentProject = { project };
      let rootTask = await taskModel.findOne({ project, taskId: '0' }).lean();

      let allWPTasks = await taskModel
        .find({ project, workPackage: true })
        .populate('projectLocation', 'pathId')
        .sort({ plannedStartDate: 1 })
        .lean();
      let weightageMap = allWPTasks.reduce((map, task) => {
        map[task.taskId] = task.weightage;
        return map;
      }, {});
      let monitorings = await monitoringModel
        .find(currentProject)
        .populate('task', ['projectLocation', 'actualStartDate', 'actualEndDate']);
      let monitoringsCost;

      let monActBrk;

      let firstPlannedTask = await taskModel
        .findOne({ project, actualStartDate: { $ne: null }, workPackage: true })
        .sort({ actualStartDate: 1 })
        .lean();
      let drows = await taskModel.find({
        project,
        workPackage: true,
        completed: { $ne: 100 }
      });
      let completionDate = null;
      if (drows.length == 0) {
        drows = await taskModel.find({ project, workPackage: true }).sort({ plannedEndDate: -1 }).limit(1);
        completionDate = drows[0].actualEndDate;
      }


      let tasks = allWPTasks;
      let prev = null;

      let monthList = createMonthlyArray(new Date(allWPTasks[0].plannedEndDate), undefined, config);

      let monPlnBrk = allWPTasks.reduce(
        (map, task) => {
          let monthID0 = startOfMonth(new Date(task.plannedStartDate));
          let ad = new Date(task.plannedEndDate);
          let monthID = startOfMonth(ad);
          let nextMonth = addMonths(monthID0, 1);
          let months = [monthID0]
          if (!map.monthly[monthID0]) {
            map.monthly[monthID0] = {
              plannedCost: 0,
              plannedCompletion: 0,
              cumPlnCost: 0,
              cumPlnComp: 0,
              cumPlnVal: 0
            };
          }

          while (nextMonth <= ad) {
            months.push(nextMonth);
            if (!map.monthly[nextMonth]) {
              map.monthly[nextMonth] = {
                plannedCost: 0,
                plannedCompletion: 0,
                cumPlnCost: 0,
                cumPlnComp: 0,
                cumPlnVal: 0
              };
            }

            nextMonth = addMonths(nextMonth, 1);
          }


          map.monthly[monthID].plannedCost = map.monthly[monthID].plannedCost + task.plannedCost;
          map.monthly[monthID].plannedCompletion =
            map.monthly[monthID].plannedCompletion + weightageMap[task.taskId];
          map.budAtComp = map.budAtComp + task.plannedCost;
          return map;
        },
        { budAtComp: 0, monthly: {} }
      );

      let lastMonitoredMonth;

      let firstD = null;
      if (monitorings.length > 0) {
        let query = [
          { $sort: { lastMonitoringDate: 1 } },
          { $match: currentProject },
          {
            $group: {
              _id: '$taskId',
              actualCost: '$actualCost',
              completion: '$completionVariance',
              lastMonitoringDate: '$monitoringDate'
              // actualCost: {$sum: '$actualCost' },
              // completion: {$last: '$completion' },
              // completionVariance:
              // lastMonitoringDate: {$last: '$monitoringDate' }
            }
          }
        ];

        monitoringsCost = await monitoringModel.find(currentProject).sort({ monitoringDate: 1 });



        monActBrk = monitoringsCost.reduce(
          (map, monitoring) => {
            let monthID = startOfMonth(new Date(monitoring.monitoringDate));
            if (!map.monthly[monthID])
              map.monthly[monthID] = {
                actualCost: 0,
                actualCompletion: 0,
                cumActCost: 0,
                cumulativeActualCompletion: 0,
                cumEarVal: 0
              };

            // if (task.completion == 100) {
            map.totalActualCost += monitoring.actualCost;
            map.totalActualCompletion += weightageMap[monitoring.taskId];
            map.monthly[monthID].actualCost += monitoring.actualCost;
            map.monthly[monthID].actualCompletion += weightageMap[monitoring.taskId] * (monitoring.completionVariance * 0.01);
            // }
            return map;
          },
          {
            totalActualCost: 0,
            totalActualCompletion: 0,
            monthly: {}
          }
        );


        Object.keys(monActBrk.monthly).sort((a, b) => new Date(a) - new Date(b)).forEach((key) => {
          if (!firstD) firstD = key;
          // monActBrk.monthly[key].cumActCost = (prev ? monActBrk.monthly[prev].cumActCost : 0) + monActBrk.monthly[key].actualCost;
          monActBrk.monthly[key].cumActCost =
            _.get(monActBrk, `monthly.${prev}.cumActCost`, 0) + monActBrk.monthly[key].actualCost;
          monActBrk.monthly[key].cumulativeActualCompletion =
            _.get(monActBrk, `monthly.${prev}.cumulativeActualCompletion`, 0) +
            monActBrk.monthly[key].actualCompletion;
          // monActBrk.monthly[key].cumulativeActualCompletion = monActBrk.monthly[key].actualCompletion;
          monActBrk.monthly[key].cumEarVal =
            monActBrk.monthly[key].cumulativeActualCompletion * monPlnBrk.budAtComp;
          prev = key;
        });
        lastMonitoredMonth = prev;
        prev = null;



      }
      console.log()
      let D = [_.get(monActBrk, `mon.${firstD}.cumActCost`, 0)];
      let A = [D[0]],
        T = [0];

      let EVMValuesPerMonth = [];


      Object.keys(monPlnBrk.monthly).sort((a, b) => new Date(a) - new Date(b)).forEach((key, t) => {
        // monPlnBrk.monthly[key].cumPlnCost = (prev ? monPlnBrk.monthly[prev].cumPlnCost : 0) + monPlnBrk.monthly[key].plannedCost;
        monPlnBrk.monthly[key].cumPlnCost =
          _.get(monPlnBrk, `monthly.${prev}.cumPlnCost`, 0) + monPlnBrk.monthly[key].plannedCost;
        monPlnBrk.monthly[key].cumPlnComp =
          _.get(monPlnBrk, `monthly.${prev}.cumPlnComp`, 0) + monPlnBrk.monthly[key].plannedCompletion;
        monPlnBrk.monthly[key].cumPlnVal = monPlnBrk.monthly[key].cumPlnComp * monPlnBrk.budAtComp;
        let month =
          ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][
          new Date(key).getMonth()
          ] +
          '-' +
          new Date(key).getFullYear();
        if (monitorings.length > 0) {
          D.push(monActBrk.monthly[key] ? monActBrk.monthly[key].cumActCost : 0);
          EVMValuesPerMonth.push({
            RecordDate: month,
            LastMonitoring: lastMonitoredMonth == key,
            PV: monPlnBrk.monthly[key].cumPlnVal,
            AC: _.get(monActBrk, `monthly.${key}.cumActCost`, 0),
            EV: _.get(monActBrk, `monthly.${key}.cumEarVal`, 0),
            FV: t > 0 ? EVMValuesPerMonth[t - 1].FV + getFt(t, D, A, T) : 0
            // FV: monPlnBrk.monthly[key].cumPlnVal * 1.05
          });
        } else {

          EVMValuesPerMonth.push({
            RecordDate: month,
            LastMonitoring: false,
            PV: monPlnBrk.monthly[key].cumPlnVal,
            AC: 0,
            EV: 0,
            FV: 0
            // FV: monPlnBrk.monthly[key].cumPlnVal * 1.05
          });
        }

        prev = key;
      });

      lastPlannedMonth = prev;
      let budAtComp = monPlnBrk.budAtComp;

      let plannedValue = _.get(monPlnBrk, `monthly.${lastMonitoredMonth}.cumPlnVal`, 0);
      // let plannedValue = _.get(monPlnBrk, `monthly.${lastPlannedMonth}.cumPlnVal`, 0);
      let earnedValue = 0;
      let actualCost = 0;
      let currentMonthActualCost = 0, currentMonthPlannedCost = 0;
      if (lastMonitoredMonth) {
        // earnedValue = lastMonitoredMonth ? _.get(monActBrk, `monthly.${lastMonitoredMonth}.cumEarVal`, 0) : 0;
        // actualCost = lastMonitoredMonth ? _.get(monActBrk, `monthly.${lastMonitoredMonth}.cumActCost`, 0) : 0;
        // currentMonthActualCost =   _.get(monActBrk, `monthly.${startOfMonth(new Date())}.actualCost`, 0) ;
        // currentMonthPlannedCost = _.get(monPlnBrk, `monthly.${startOfMonth(new Date())}. plannedCost`, 0);



        earnedValue = monActBrk.monthly[lastMonitoredMonth].cumEarVal;
        actualCost = monActBrk.monthly[lastMonitoredMonth].cumActCost;
        currentMonthActualCost = monActBrk.monthly[startOfMonth(new Date())] ? monActBrk.monthly[startOfMonth(new Date())].actualCost : 0;
        currentMonthPlannedCost = monPlnBrk.monthly[startOfMonth(new Date())] ? monPlnBrk.monthly[startOfMonth(new Date())].plannedCost : 0;
        //currentMonthActualCost = startOfMonth(new Date()) astMonitoredMonth && firs? _.get(monActBrk, `monthly.${lastMonitoredMonth}.actualCost`, 0) : 0;

      }


      let costVariance = earnedValue - actualCost;
      let scheduleVariance = earnedValue - plannedValue;
      let scheduleVarianceInDays = scheduleVariance * 30;
      let scheduleStatus = 'On Schedule';
      if (scheduleVariance > 0) scheduleStatus = 'Ahead of schedule';
      if (scheduleVariance < 0) scheduleStatus = 'Behind schedule';
      let costStatus = 'On budget';
      if (costVariance > 0) costStatus = 'Under budget';
      if (costVariance < 0) costStatus = 'Over budget';
      let CPI = earnedValue / actualCost;
      let SPI = earnedValue / plannedValue;
      let estimateAtCompletion = actualCost + (budAtComp - earnedValue) / (SPI * CPI);
      // let estimateAtCompletion = budAtComp  /CPI;
      let varianceAtCompletion = budAtComp - estimateAtCompletion;
      v = estimateAtCompletion - actualCost;
      let TCPI = budAtComp != earnedValue ? (budAtComp - earnedValue) / (estimateAtCompletion - actualCost) : 0;
      let actualDaysSinceExecution = businessDays(
        firstPlannedTask ? firstPlannedTask.actualStartDate : new Date(),
        completionDate || new Date()
      );
      let totalPlannedDays = businessDays(rootTask.plannedStartDate, rootTask.plannedEndDate);

      let performanceData = {
        PerformanceCostData: {
          ActualCost: currentMonthActualCost, // actual cost for the current month
          AverageMonthlyCost: currentMonthPlannedCost, // total cost divided by the total budget
          PurpleRange: [0, currentMonthPlannedCost],
          YellowRange: [currentMonthPlannedCost, currentMonthPlannedCost * 1.25],
          RedRange: [currentMonthPlannedCost * 1.25, currentMonthPlannedCost * 1.5]
        },
        PerformanceBudgetData: {
          TotalEstimatedBudget: budAtComp, //sum of all PlannedCost for Level-1 tasks
          TotalActualCost: actualCost,
          PurpleRange: [0, budAtComp],
          YellowRange: [budAtComp, budAtComp + 0], // plus management reserve
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
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskUtilizedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualResourceBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { $or: [{ boqType: '1' }, { __type: 'TaskPlannedResource' }] }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      let plannedResourceBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualLaborBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '1' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
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
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let actualContractorEquipmentBreakup = (await taskUtilizedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '3' }]
          }
        },
        {
          $group: {
            _id: { task: '$task' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let plannedContractorEquipmentBreakup = (await taskPlannedResourceModel.aggregate(
        query
      )).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task] = { qty: row.qty, total: row.total };
        return obj;
      }, {});
      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { task: '$task', rankId: '$top3', material: '$description' },
            total: { $sum: { $multiply: ['$cost', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];
      let consumableMaterialBreakup = (await taskPlannedResourceModel.aggregate(query)).reduce((obj, row) => {
        if (!obj[row._id.task]) obj[row._id.task] = {};
        obj[row._id.task][row._id.rankId] = {
          material: row._id.material,
          Planned: { qty: row.qty, total: row.total }
        };
        return obj;
      }, {});

      query = [
        {
          $match: {
            $and: [{ project }, { boqType: '4' }, { top3: { $ne: 0 } }]
          }
        },
        {
          $group: {
            _id: { task: '$task', rankId: '$top3' },
            total: { $sum: { $multiply: ['$actualCostPerUnit', '$quantity'] } },
            qty: { $sum: '$quantity' }
          }
        }
      ];

      // let consumableMaterialBreakup = (await taskUtilizedResourceModel.aggregate(query)).reduce((obj, row) => {
      //   // if (!obj[row._id.task]) obj[row._id.task] = {};
      //   obj[row._id.task][row._id.rankId].Actual = {  qty: row.qty, total: row.total };
      //   return obj;
      // }, plannedConsumableMaterialBreakup);

      let utilizedResources = await taskUtilizedResourceModel.aggregate(query);
      utilizedResources.forEach((row) => {
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
        completionDate,
        monitoringsCost,
        actualLaborBreakup,
        plannedLaborBreakup,
        actualResourceBreakup,
        plannedResourceBreakup,
        actualContractorEquipmentBreakup,
        plannedContractorEquipmentBreakup,
        consumableMaterialBreakup,
        EVMValuesPerMonth
      };
      return res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  showStartDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;
      taskModel.find({ project: id }, 'plannedStartDate').exec(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + '| task found';
        log.write('INFO', LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  showEndDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;
      taskModel.find({ project: id }, 'plannedEndDate').exec(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + '| task found';
        log.write('INFO', LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  showTotalPlannedCostByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.projectId;

      taskModel.aggregate(
        [
          {
            $match: {
              project: ObjectId(id),
              workPackage: true
            }
          },
          {
            $group: {
              _id: null,
              plannedCost: { $sum: '$plannedCost' }
            }
          }
        ],
        // [{project: id, workPackage: true ,"totalPlannedCost":{$sum:'$plannedCost'}}]).exec(
        function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');
          const LOGMESSAGE = DATETIME + '| task found';
          log.write('INFO', LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        }
      );
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  showMilestonesByProjetId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.projectId;
      taskModel.find({ project: id, milestone: true }).exec(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting project.');
        if (!task) {
          respondWithNotFound(res, 'No such task');
        } else if (task.length == 0) {
          const LOGMESSAGE = DATETIME + '|No such milestone found';
          log.write('ERROR', LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: 'No milestone found'
          });
        }
        const LOGMESSAGE = DATETIME + '| task found';
        log.write('INFO', LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  showWorkPackagesByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.projectId;
      taskModel.find({ project: id, workPackage: true }).exec(function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting project.');
        if (!task) {
          respondWithNotFound(res, 'No such task');
        } else if (task.length == 0) {
          const LOGMESSAGE = DATETIME + '|No such workpackage found';
          log.write('ERROR', LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: 'No workpackage found'
          });
        }
        const LOGMESSAGE = DATETIME + '| task found';
        log.write('INFO', LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');

      var task = new taskModel(req.body);
      taskModel.create(req.body, function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        const LOGMESSAGE = DATETIME + '|task created';
        log.write('INFO', LOGMESSAGE);
        // return res.status(201).json(task);
        return res.json({ success: true, msg: 'task is created', data: task });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  wbs: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      taskModel.deleteMany({ project: req.body[0].project }, function (err, task) {

        if (err) respondWithError(res, err, 'Error when deleting task.');
        if (!task) respondWithNotFound(res, 'No such task');

        taskModel.insertMany(req.body, function (err, data) {
          console.log(err)
          if (err) respondWithError(res, err, 'Error when creating task.');
          const LOGMESSAGE = DATETIME + '|task created';
          log.write('INFO', LOGMESSAGE);
          // return res.status(201).json(task);
          return res.json({
            success: true,
            msg: req.body.length + ' task(s) created',
            data: data
          });
        });
      });
    } catch (error) {
      console.log(error)
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  updateWorkPackages: function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var id = req.params.id;
      var arrBody = req.body.workPackages;
      arrBody.forEach((element, index) => {

        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');
          if (element.actualStartDate) task.actualStartDate = element.actualStartDate;
          if (element.completed) task.completed = element.completed;
          task.updatedDate = DATETIME;
          task.updatedBy = element.updatedBy ? element.updatedBy : task.updatedBy;

          task.save(function (err, task) {
            if (err) respondWithError(res, err, 'Error when updating task.');
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + '|Updated task:' + id;
              log.write('INFO', LOGMESSAGE);
              return res.json({ success: true, msg: 'task list is updated' });
            }
            // return res.json(task);
          });
        });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  markMonitorings: function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var id = req.params.id;
      taskModel.find(
        {
          project: id,
          monitoringstatus: {
            $ne: 'OPEN'
          },
          actualStartDate: {
            $lte: new Date()
          },
          workPackage: true,
          completed: {
            $ne: 100
          },
          $or: [
            {
              lastMonitoredOn: null
            },
            {
              lastMonitoredOn: {
                $lt: new Date()
              }
            }
          ]
        },
        function (err, tasks) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!tasks) {
            const LOGMESSAGE = DATETIME + '|NO Such task of project:' + id;
            log.write('ERROR', LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: 'No such task'
            });
          }

          tasks.forEach(async (currTask) => {

            let nextCycleData = nextCycle(
              currTask.monitoringFrequency,
              currTask.plannedStartDate,
              currTask.plannedEndDate
            )[0];
            currTask.cycleEndsOn = nextCycleData.date;
            currTask.cycleDays = nextCycleData.days;
            currTask.monitoringStatus = 'OPEN';
            await currTask.save(function (err, Ttask) {
              if (err) respondWithError(res, err, 'Error when updating task.');

              const LOGMESSAGE = DATETIME + '|Updated task:';
              log.write('INFO', LOGMESSAGE);
              // return res.json({success: true, msg: "task list is updated" });
            });
          });
          const LOGMESSAGE = DATETIME + '|task found of project:' + id;
          log.write('INFO', LOGMESSAGE);
          return res.json({ success: true, data: [] });
          // return res.json(task);
        }
      );
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  updateWorkPackage: function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    try {
      var element = req.body.workPackage;
      taskModel.findOne({ _id: element._id }, function (err, task) {
        if (err) respondWithError(res, err, 'Error when getting task.');
        if (!task) respondWithNotFound(res, 'No such task');

        if (element.monitoringStatus) task.monitoringStatus = element.monitoringStatus;
        if (element.actualStartDate) task.actualStartDate = element.actualStartDate;
        if (element.quantityConsumed)
          task.quantityConsumed =
            (task.quantityConsumed ? task.quantityConsumed : 0) + element.quantityConsumed;
        if (element.costIncurred)
          task.costIncurred = (task.costIncurred ? task.costIncurred : 0) + element.costIncurred;
        if (element.lastMonitoredOn) task.lastMonitoredOn = DATETIME;
        if (element.completed) task.completed = element.completed;
        if (element.updatedBy) task.updatedBy = element.updatedBy;
        task.updatedDate = DATETIME;
        task.save(function (err, task) {
          if (err) respondWithError(res, err, 'Error when updating task.');
          const LOGMESSAGE = DATETIME + '|Updated task:' + element._id;
          log.write('INFO', LOGMESSAGE);
          return res.json({ success: true, msg: 'task list is updated' });
        });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },
  start: function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var { updatedStatus } = req.body;
    let ids = updatedStatus.id.split(".").reduce((ids, id, i) => { ids.push(ids.length > 0 ? ids[i - 1] + "." + id : id); return ids; }, []);

    taskModel.updateMany({ project: updatedStatus.project, actualStartDate: null, taskId: { $in: ['0', ...ids] } }, { actualStartDate: updatedStatus.actualStartDate }).then(({ _doc }) => {

      res.status(200).json(_doc);
    }).catch(error => {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task",
        error: error,
      });
    });
  },
  updateStatus: function (req, res) {
    const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var { updatedStatus } = req.body;
    let ids = updatedStatus.id.split(".").reduce((ids, id, i) => { ids.push(ids.length > 0 ? ids[i - 1] + "." + id : id); return ids; }, []);
    ids.pop();
    let weightedCompletion = ((updatedStatus.completed - updatedStatus.completedVar) * updatedStatus.weightage) / 100;
    if (ids.length > 0) {
      let query = [{
        $set: {
          actualCost: {
            $add: ["$actualCost", updatedStatus.actualCost]
          },
          completed: {
            $add: ["$completed", {
              $multiply: [{
                $divide: [weightedCompletion, "$weightage"]
              }, 100]
            }]
          }
        }
      }];
      taskModel.updateMany({ project: updatedStatus.project, taskId: { $in: ['0', ...ids] } }, query).then(() => {
        // taskModel.updateMany({ project: updatedStatus.project, taskId: { $in: ['0', ...ids] } }, [{ $set: { actualCost: { $add: ["$actualCost", updatedStatus.actualCost] }, completed: { $add: ["$completed", { $multiply: ["$weightage", weightedCompletion] }] } } }]).then(() => {

        //      taskModel.updateMany({ project: updatedStatus.project, taskId: { $in: ['0', ...ids] } }, { $inc: { actualCost: updatedStatus.actualCost, completed: { $multiply: ["$weightage", weightedCompletion] } } }).then(() => {
        taskModel.findByIdAndUpdate(updatedStatus._id, {
          $inc: { actualCost: updatedStatus.actualCost },
          lastMonitoring: updatedStatus.lastMonitoring,
          lastMonitoredOn: DATETIME,
          ...(updatedStatus.completed && {
            actualEndDate: updatedStatus.completed == 100 ? DATETIME : null,
            monitoringStatus: updatedStatus.monitoringStatus,
            completed: updatedStatus.completed
          })
        }).then(({ _doc }) => {
          res.status(200).json({ weightage: _doc.weightage });
        }).catch(error => {
          const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task",
            error: error,
          });
        });


      });
    }





  },
  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {

        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) respondWithError(res, err, 'Error when getting task.');
          if (!task) respondWithNotFound(res, 'No such task');



          task.project = element.project ? element.project : task.project;
          task.monitoringFrequency = element.monitoringFrequency
            ? element.monitoringFrequency
            : task.monitoringFrequency;
          task.parentTask = element.parentTask ? element.parentTask : task.parentTask;
          task.description = element.description ? element.description : task.description;
          task.plannedStartDate = element.plannedStartDate ? element.plannedStartDate : task.plannedStartDate;
          task.plannedEndDate = element.plannedEndDate ? element.plannedEndDate : task.plannedEndDate;
          task.workPackage = element.workPackage;
          task.plannedCost = element.plannedCost ? element.plannedCost : task.plannedCost;
          task.milestone = element.milestone;
          task.updatedDate = DATETIME;
          task.updatedBy = element.updatedBy ? element.updatedBy : task.updatedBy;

          task.save(function (err, task) {
            if (err) respondWithError(res, err, 'Error when updating task.');
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + '|Updated task:' + id;
              log.write('INFO', LOGMESSAGE);
              return res.json({ success: true, msg: 'task list is updated' });
            }

          });
        });
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      var id = req.params.taskId;
      var projectId = req.params.projectId;


      taskModel.deleteOne({ taskId: id, project: projectId }, function (err, task) {
        if (err) respondWithError(res, err, 'Error when deleting task.');
        if (!task) respondWithNotFound(res, 'No such task');
        const LOGMESSAGE = DATETIME + '|removed task:' + id;
        log.write('INFO', LOGMESSAGE);
        return res.json({ success: true, msg: 'task is deleted' });
        // return res.status(204).json();
      });
    } catch (error) {
      respondWithError(res, error, 'Error when getting task.');
    }
  }
};
