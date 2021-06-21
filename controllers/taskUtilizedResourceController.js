const dateFormat = require("dateformat");
const ObjectId = require('mongoose').Types.ObjectId;

const taskUtilizedResourceBaseModel = require("../models/taskUtilizedResourceBaseModel");
const taskPlannedResourceModel = require("../models/taskPlannedResourceBaseModel");
const taskUtilizedResourceModel = require("../models/taskUtilizedResourceModel");
const taskUtilizedBOQModel = require("../models/taskUtilizedBOQModel");
const monitoringModel = require("../models/monitoringModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskUtilizedResourceModel.find(function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskUtilizedResource.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskUtilizedResource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskUtilizedResource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }


  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var taskId = req.params.taskId;
      taskUtilizedResourceModel.find({ project: id, task: taskId }).exec(function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskUtilizedResource.",
            error: err
          });
        }
        if (!taskUtilizedResource) {
          const LOGMESSAGE = DATETIME + "|No such taskUtilizedResource:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskUtilizedResource:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|taskUtilizedResource Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskUtilizedResource });
        // return res.json(taskUtilizedResource);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }

  },
  showByProject: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
     
      var {projectId} = req.params;
      
      taskUtilizedResourceBaseModel.find({project: projectId}, function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskUtilizedResource.",
            error: err
          });
        }
        if (!taskUtilizedResource) {
          const LOGMESSAGE = DATETIME + "|NO Such taskUtilizedResource of project:" + projectId;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskUtilizedResource"
          });
        }
        const LOGMESSAGE = DATETIME + "|taskUtilizedResource found of project:" + projectId;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskUtilizedResource });

      }).populate('tpr','resourceType').populate("resource", "resourceName");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }

  },
  // showSummaryByProject: function (req, res) {
  //   const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //   try {
     
  //     var {projectId} = req.params;
      
  //     taskUtilizedResourceBaseModel.aggregate([{$match: {project: projectId}},{$group:{_id: {wp: "$wp",resource: "$resource"} }}], function (err, taskUtilizedResource) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success: false,
  //           msg: "Error when getting taskUtilizedResource.",
  //           error: err
  //         });
  //       }
  //       if (!taskUtilizedResource) {
  //         const LOGMESSAGE = DATETIME + "|NO Such taskUtilizedResource of project:" + projectId;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success: false,
  //           msg: "No such taskUtilizedResource"
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|taskUtilizedResource found of project:" + projectId;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({ success: true, data: taskUtilizedResource });

  //     }).populate('tpr','resourceType').populate("resource", "resourceName");
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success: false,
  //       msg: "Error when getting taskUtilizedResource.",
  //       error: error
  //     });
  //   }

  // },


  create: async function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let errors = [], data = [];
    try {
    //   if (req.body.tasks.length > 0) {
    //     await monitoringModel.insertMany(req.body.tasks).then((_doc) => {
    //       data.push({ success: true, msg: "monitoring is created", data: _doc });
    //       const LOGMESSAGE = DATETIME + "|monitoring created";
    //       log.write("INFO", LOGMESSAGE);
    //     }).catch(err => {
    //       const LOGMESSAGE = DATETIME + "|" + err.message;
    //       log.write("ERROR", LOGMESSAGE);
    //       errors.push({
    //         success: false,
    //         msg: "Error when creating monitoring",
    //         error: err
    //       });
    //     });
    //   }

      if (req.body.resources.length > 0) {
        await taskUtilizedResourceModel.insertMany(req.body.resources).then(result => {
          data.push({ success: true, msg: "taskUtilizedResource is created", data: result });
          const LOGMESSAGE = DATETIME + "|taskUtilizedResource created";
          log.write("INFO", LOGMESSAGE);
          req.body.resources.forEach(resource => {
            taskPlannedResourceModel.updateOne({ _id: resource.taskPlannedResource }, { $inc: { costIncurred: (resource.actualCostPerUnit * resource.quantity), quantityConsumed: resource.quantity } }, function (err, DATA) {
            });
          })
        }).catch(err => {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          errors.push({ success: false, msg: "Error when creating taskUtilizedResource", error: err });
        })
      }

      if (req.body.BOQ.length > 0) {
        await taskUtilizedBOQModel.insertMany(req.body.BOQ).then(result => {
          data.push({ success: true, msg: "taskUtilizedBOQ is created", data: result });
          const LOGMESSAGE = DATETIME + "|taskUtilizedBOQ created";
          log.write("INFO", LOGMESSAGE);
          req.body.BOQ.forEach(bq => {
            taskPlannedResourceModel.updateOne({ _id: bq.taskPlannedResource }, { $inc: { costIncurred: (bq.actualCostPerUnit * bq.quantity), quantityConsumed: bq.quantity } }, function (err, DATA) {

            });
          })
        }).catch(err => {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          errors.push({ success: false, msg: "Error when creating taskUtilizedBOQ", error: err });
        })


      }

      res.json(data);

    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      errors.push({ success: false, msg: "Errors", error: error })
      return res.status(500).json(errors);
    }
  },

  oldcreate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var taskUtilizedResource = new taskUtilizedResourceModel({
        project: req.body.project,
        task: req.body.task,
        resource: req.body.resource,
        monitoring: req.body.monitoring,
        quantity: req.body.quantity,
        actualCostPerUnit: req.body.actualCostPerUnit,


      });

      taskUtilizedResource.save(function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating taskUtilizedResource",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskUtilizedResource created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(taskUtilizedResource);
        return res.json({ success: true, msg: "taskUtilizedResource is created", data: taskUtilizedResource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      taskUtilizedResourceModel.findOne({ _id: id }, function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskUtilizedResource",
            error: err
          });
        }
        if (!taskUtilizedResource) {
          const LOGMESSAGE = DATETIME + "|No such taskUtilizedResource to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskUtilizedResource"
          });
        }
        taskUtilizedResource.project = req.body.project ? req.body.project : taskUtilizedResource.project,
          taskUtilizedResource.task = req.body.task ? req.body.task : taskUtilizedResource.task,
          taskUtilizedResource.resource = req.body.resource ? req.body.resource : taskUtilizedResource.resource,
          taskUtilizedResource.monitoring = req.body.monitoring ? req.body.monitoring : taskUtilizedResource.monitoring,
          taskUtilizedResource.quantity = req.body.quantity ? req.body.quantity : taskUtilizedResource.quantity,
          taskUtilizedResource.actualCostPerUnit = req.body.actualCostPerUnit ? req.body.actualCostPerUnit : taskUtilizedResource.actualCostPerUnit,

          taskUtilizedResource.save(function (err, taskUtilizedResource) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating taskUtilizedResource.",
                error: err
              });
            }
            const LOGMESSAGE = DATETIME + "|Updated taskUtilizedResource:" + id;
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, msg: "taskUtilizedResource is updated", data: taskUtilizedResource });
            // return res.json(taskUtilizedResource);
          });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var taskId = req.params.taskId
      taskUtilizedResourceModel.deleteMany({ project: id, task: taskId }, function (err, taskUtilizedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the taskUtilizedResource.",
            error: err
          });
        }
        if (!taskUtilizedResource) {
          const LOGMESSAGE = DATETIME + "|taskUtilizedResource not found to delete|" + taskUtilizedResource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed taskUtilizedResource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "taskUtilizedResource is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskUtilizedResource.",
        error: error
      });
    }

  }
};
