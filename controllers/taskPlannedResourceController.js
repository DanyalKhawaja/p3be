const dateFormat = require("dateformat");
var mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const taskPlannedResourceModel = require("../models/taskPlannedResourceModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskPlannedResourceModel.find(function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskPlannedResource.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskPlannedResource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskPlannedResource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskPlannedResourceModel.findOne({ _id: id }).exec(function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskPlannedResource.",
            error: err
          });
        }
        if (!taskPlannedResource) {
          const LOGMESSAGE = DATETIME + "|No such taskPlannedResource:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskPlannedResource:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|taskPlannedResource Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskPlannedResource });
        // return res.json(taskPlannedResource);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },
  showByTaskIdProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.taskId;
      var projectId = req.params.projectId
      taskPlannedResourceModel.find({ project: projectId, task: id }, function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskPlannedResource.",
            error: err
          });
        }
        if (!taskPlannedResource) {
          const LOGMESSAGE = DATETIME + "|NO Such taskPlannedResource of project:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskPlannedResource"
          });
        }
        const LOGMESSAGE = DATETIME + "|taskPlannedResource found of project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskPlannedResource });
        // return res.json(taskPlannedResource);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },
  showByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var projectId = req.params.projectId;

      taskPlannedResourceModel.find({ project: projectId }, function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskPlannedResource." + projectId,
            error: err
          });
        }
        if (!taskPlannedResource) {
          const LOGMESSAGE = DATETIME + "|NO Such taskPlannedResource of project:" + projectId;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskPlannedResource"
          });
        }
        const LOGMESSAGE = DATETIME + "|taskPlannedResource found of project:" + projectId;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskPlannedResource });
        // return res.json(taskPlannedResource);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },


  showTaskCost: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.taskId;
      var projetId = req.params.projectId
      console.log(typeof Number(id), projetId)
      taskPlannedResourceModel.aggregate([{
        $match: {
          task: Number(id),
          project: ObjectId(projetId)
        },
      }, {
        $group: {
          _id: null,
          cost: { $sum: { $multiply: ['$quantity', '$resourceCostPerUnit'] } }
        }
      }]).exec(function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskPlannedResource.",
            error: err
          });
        }
        if (!taskPlannedResource) {
          const LOGMESSAGE = DATETIME + "|No such taskPlannedResource";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskPlannedResource"
          });
        }
        const LOGMESSAGE = DATETIME + "| taskPlannedResource found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: taskPlannedResource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      // var taskPlannedResource = new taskPlannedResourceModel({
      // project: req.body.project,
      // task: req.body.task,
      // resource: req.body.resource,docker
      // quantity: req.body.quantity,
      // resourceCostPerUnit:req.body.resourceCostPerUnit,


      // });
      taskPlannedResourceModel.deleteMany({ project: req.body[0].project }, function (err, taskPlannedResource1) {

        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the taskPlannedResource.",
            error: err
          });
        }

        taskPlannedResourceModel.insertMany(req.body, function (err, taskPlannedResource2) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating taskPlannedResource",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|taskPlannedResource created";
          log.write("INFO", LOGMESSAGE);
          // return res.status(201).json(taskPlannedResource);
          return res.json({ success: true, msg: "taskPlannedResource is created", data: taskPlannedResource2 });
        });

      });

    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      // var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {
        taskPlannedResourceModel.findOne({ _id: element._id }, function (err, taskPlannedResource) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting taskPlannedResource",
              error: err
            });
          }
          if (!taskPlannedResource) {
            const LOGMESSAGE = DATETIME + "|No such taskPlannedResource to update:" + element._id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such taskPlannedResource"
            });
          }
          // taskPlannedResource.project= element.project?element.project :taskPlannedResource.project,
          // taskPlannedResource.task= element.task?element.task : taskPlannedResource.task,
          // taskPlannedResource.resource= element.resource?element.resource :taskPlannedResource.resource,
          // taskPlannedResource.quantity= element.quantity?element.quantity :taskPlannedResource.quantity ,
          // taskPlannedResource.resourceCostPerUnit=element.resourceCostPerUnit?element.resourceCostPerUnit : taskPlannedResource.resourceCostPerUnit,
          var taskPlannedResourceJson = {
            project: element.project ? element.project : taskPlannedResource.project,
            task: element.task ? element.task : taskPlannedResource.task,
            resource: element.resource ? element.resource : taskPlannedResource.resource,
            quantity: element.quantity ? element.quantity : taskPlannedResource.quantity,
            resourceCostPerUnit: element.resourceCostPerUnit ? element.resourceCostPerUnit : taskPlannedResource.resourceCostPerUnit,
          }
          taskPlannedResourceModel.updateOne({ _id: element._id }, taskPlannedResourceJson, function (err, taskPlannedResource) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating taskPlannedResource.",
                error: err
              });
            }
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + "|Updated taskPlannedResource:" + element._id;
              log.write("INFO", LOGMESSAGE);
              return res.json({ success: true, msg: "taskPlannedResource list is updated", data: taskPlannedResource });
            }

            // return res.json(taskPlannedResource);
          });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskPlannedResourceModel.findByIdAndRemove(id, function (err, taskPlannedResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the taskPlannedResource.",
            error: err
          });
        }
        if (!taskPlannedResource) {
          const LOGMESSAGE = DATETIME + "|taskPlannedResource not found to delete|" + taskPlannedResource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed taskPlannedResource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "taskPlannedResource is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskPlannedResource.",
        error: error
      });
    }

  }
};
