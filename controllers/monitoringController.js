const dateFormat = require("dateformat");

const monitoringModel = require("../models/monitoringModel");
const taskModel = require("../models/taskModel");

const log = require('../lib/logger');

module.exports = {
  list: function (_, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      monitoringModel.find(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoring List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: monitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var taskId = req.params.taskId;
      monitoringModel.find({ project: id, task: taskId }).exec(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoring Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: monitoring });
        // return res.json(monitoring);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showPopulatedByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.find({ project: id }).populate('task',['projectLocation' ,'actualStartDate', 'actualEndDate','completed']).exec(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoring Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: monitoring });
        // return res.json(monitoring);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showMonitoringByTaskId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.findOne({ task: id }, function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|NO Such monitoring of project:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring"
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoring found of project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: monitoring });
        // return res.json(monitoring);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }
  },



  showCompletedTask: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.find({ project: id, completion: 100 }).populate("task").exec(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring"
          });
        }
        const LOGMESSAGE = DATETIME + "| monitoring found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: monitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showTaskWithMonitoring: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.find({ project: id, completion: { $gt: 0, $lt: 100 } }).populate("task").exec(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring"
          });
        }
        const LOGMESSAGE = DATETIME + "| monitoring found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: monitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showTaskWithNoMonitoring: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      var plannedStartDate = req.params.plannedStartDate;
      console.log((plannedStartDate < DATETIME), plannedStartDate, DATETIME)
      if (!(plannedStartDate < DATETIME)) {
        const LOGMESSAGE = DATETIME + "|Planned start date must be less than current date";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).json({
          success: false,
          msg: "Planned start date must be less than current date"
        });
      }
      taskModel.find({ project: id, plannedStartDate: plannedStartDate }).exec(function (err, task) {
        // const LOGMESSAGE = DATETIME + "| monitoring found";
        // log.write("INFO", LOGMESSAGE);
        // return res.status(200).json({ success: true, data: task });
        var tasks = [];
        task.forEach(
          function (row) {
            tasks.push(row.taskId);
          });
        console.log(tasks)
        monitoringModel.find({ task: tasks }).exec(function (err, monitoring) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting monitoring.",
              error: err
            });
          }
          if (!monitoring) {
            const LOGMESSAGE = DATETIME + "|No such monitoring";
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such monitoring"
            });
          }
          // console.log(monitoring)
          if (monitoring && monitoring.length == 0) {
            const LOGMESSAGE = DATETIME + "| monitoring found";
            log.write("INFO", LOGMESSAGE);
            return res.status(200).json({ success: true, data: task });
          } else {
            var taskResult = []
            task.forEach(async (element, index) => {
              // console.log(monitoring)
              var result = searchNoMonitoring(element, monitoring);
              // console.log(result)
              if (result) {
                taskResult.push(result);
              }
              if (index == task.length - 1) {
                const LOGMESSAGE = DATETIME + "| monitoring found";
                log.write("INFO", LOGMESSAGE);
                return res.status(200).json({ success: true, data: taskResult });
              }
            });

          }

        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showTaskWithPlannedStatDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      var plannedStartDate = req.params.plannedStartDate;
      console.log((plannedStartDate < DATETIME), plannedStartDate, DATETIME)
      if (!(plannedStartDate < DATETIME)) {
        const LOGMESSAGE = DATETIME + "|Planned start date must be less than current date";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).json({
          success: false,
          msg: "Planned start date must be less than current date"
        });
      }
      taskModel.find({ project: id, plannedStartDate: plannedStartDate }).exec(function (err, task) {
        // const LOGMESSAGE = DATETIME + "| monitoring found";
        // log.write("INFO", LOGMESSAGE);
        // return res.status(200).json({ success: true, data: task });
        var tasks = [];
        task.forEach(
          function (row) {
            tasks.push(row.taskId);
          });
        console.log(tasks)
        monitoringModel.find({ task: tasks }).exec(function (err, monitoring) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting monitoring.",
              error: err
            });
          }
          if (!monitoring) {
            const LOGMESSAGE = DATETIME + "|No such monitoring";
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such monitoring"
            });
          }
          // console.log(monitoring)
          if (monitoring && monitoring.length == 0) {
            const LOGMESSAGE = DATETIME + "| no task and monitoring found with this Planned Start Date";
            log.write("INFO", LOGMESSAGE);
            return res.status(200).json({ success: true, msg: "no task and monitoring found with this Planned Start Date", data: monitoring });
          } else {
            var taskResult = []
            task.forEach(async (element, index) => {

              var result = searchWithPlannedStartDate(element, monitoring)
              if (result) {
                taskResult.push(result);
              }
              if (index == task.length - 1) {
                const LOGMESSAGE = DATETIME + "| monitoring found";
                log.write("INFO", LOGMESSAGE);
                return res.status(200).json({ success: true, data: taskResult });
              }
            });

          }

        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },
  showTaskWithPlannedStatDateOld: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.findOne({ project: id }, "actualStartDate").exec(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Project.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring"
          });
        }
        const LOGMESSAGE = DATETIME + "| monitoring found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: monitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      let { monitoring } = req.body;
      // var monitoring = new monitoringModel({



      //   project: req.body.project,
      //   task: req.body.task,
      //   actualStartDate: req.body.actualStartDate,
      //   actualEndDate: req.body.actualEndDate,
      //   actualCost: req.body.actualCost,
      //   completion: req.body.completion,
      //   createDate: req.body.createDate,
      //   createdBy: req.body.createdBy

      // });
      var doc = new monitoringModel(monitoring);

      doc.save(function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating monitoring",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoring created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(monitoring);
        return res.json({ success: true, msg: "monitoring is created", data: monitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.findOne({ _id: id }, function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting monitoring",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|No such monitoring to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such monitoring"
          });
        }
        monitoring.project = req.body.project ? req.body.project : monitoring.project,
          monitoring.task = req.body.task ? req.body.task : monitoring.task,
          monitoring.actualStartDate = req.body.actualStartDate ? req.body.actualStartDate : monitoring.actualStartDate,
          monitoring.actualEndDate = req.body.actualEndDate ? req.body.actualEndDate : monitoring.actualEndDate,
          monitoring.actualCost = req.body.actualCost ? req.body.actualCost : monitoring.actualCost,
          monitoring.completion = req.body.completion ? req.body.completion : monitoring.completion,


          monitoring.save(function (err, monitoring) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating monitoring.",
                error: err
              });
            }
            const LOGMESSAGE = DATETIME + "|Updated monitoring:" + id;
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, msg: "monitoring is updated", data: monitoring });
            // return res.json(monitoring);
          });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringModel.findByIdAndRemove(id, function (err, monitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the monitoring.",
            error: err
          });
        }
        if (!monitoring) {
          const LOGMESSAGE = DATETIME + "|monitoring not found to delete|" + monitoring;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed monitoring:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "monitoring is Deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting monitoring.",
        error: error
      });
    }

  }
};
searchNoMonitoring = (key, inputArray) => {

  var result = []
  result = inputArray.find(item => item.task == key.taskId)
  if (!result) {
    return key;
  }
  // for (let i=0; i < inputArray.length; i++) {
  //     if (inputArray[i].task !== key.taskId) {
  //       result.push(key);
  //     }
  // }
  // return result
}
searchWithPlannedStartDate = (key, inputArray) => {
  var result = []
  result = inputArray.find(item => item.task == key.taskId)

  if (result) {
    // key["monitoring"]= result
    Object.assign(key, { monitoring: result });
    console.log(key)
    console.log(result)
    return key;
  }
  // var result = []
  // for (let i=0; i < inputArray.length; i++) {

  //     if (inputArray[i].task === key.taskId) {
  //         result.push(key);
  //     }
  // }
  // return result
}