const dateFormat = require("dateformat");

const taskChangeRequestModel = require("../models/taskChangeRequestModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskChangeRequestModel.find(function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskChangeRequest.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskChangeRequest List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskChangeRequest });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
  
      taskChangeRequestModel.find({ _id: id }).exec(function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskChangeRequest.",
            error: err
          });
        }
        if (!taskChangeRequest) {
          const LOGMESSAGE = DATETIME + "|No such taskChangeRequest:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskChangeRequest:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|taskChangeRequest Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: taskChangeRequest });
        // return res.json(taskChangeRequest);
      }); 
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var taskChangeRequest = new taskChangeRequestModel({
        task: req.body.task,
        project: req.body.project,
        parentTask: req.body.parentTask,
        description: req.body.description,
        changedStartDate: req.body.changedStartDate,
        changedEndDate: req.body.changedEndDate,
        workPackage: req.body.workPackage,
        changedCost: req.body.changedCost,
        milestone: req.body.milestone,
        changeRequestedOn: req.body.changeRequestedOn,
        changeRequestedBy: req.body.changeRequestedBy,
        reasonForChange: req.body.reasonForChange,
        assignedTo: req.body.assignedTo,
        status: req.body.status
  
      });
      taskChangeRequest.save(function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating taskChangeRequest",
            error: err
          });
        }
  
        const LOGMESSAGE = DATETIME + "|taskChangeRequest created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(taskChangeRequest);
        return res.json({ success: true, msg: "taskChangeRequest is created", data: taskChangeRequest });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskChangeRequestModel.findOne({ _id: id }, function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting taskChangeRequest",
            error: err
          });
        }
        if (!taskChangeRequest) {
          const LOGMESSAGE = DATETIME + "|No such taskChangeRequest to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such taskChangeRequest"
          });
        }
        console.log(req.body['workPackage'], req.body['workPackage'].length )
  
          taskChangeRequest.task = req.body['task'] ? req.body['task'] : taskChangeRequest.task,
          taskChangeRequest.project = req.body['project'] ? req.body['project'] : taskChangeRequest.project,
          taskChangeRequest.parentTask = req.body['parentTask'] ? req.body['parentTask'] : taskChangeRequest.parentTask,
          taskChangeRequest.description = req.body['description'] ? req.body['description'] : taskChangeRequest.description,
          taskChangeRequest.changedStartDate = req.body['changedStartDate'] ? req.body['changedStartDate'] : taskChangeRequest.changedStartDate,
          taskChangeRequest.changedEndDate = req.body['changedEndDate'] ? req.body['changedEndDate'] : taskChangeRequest.changedEndDate,
          taskChangeRequest.workPackage = req.body['workPackage'],
          taskChangeRequest.changedCost = req.body['changedCost'] ? req.body['changedCost'] : taskChangeRequest.changedCost,
          taskChangeRequest.changeRequestedOn = req.body['changeRequestedOn'] ? req.body['changeRequestedOn'] : taskChangeRequest.changeRequestedOn,
          taskChangeRequest.changeRequestedBy = req.body['changeRequestedBy'] ? req.body['changeRequestedBy'] : taskChangeRequest.changeRequestedBy,
          taskChangeRequest.updatedDate = req.body['updatedDate'] ? req.body['updatedDate'] : taskChangeRequest.updatedDate,
          taskChangeRequest.updatedBy = req.body['updatedBy'] ? req.body['updatedBy'] : taskChangeRequest.updatedBy,
          taskChangeRequest.milestone = req.body['milestone'],
          taskChangeRequest.reasonForChange = req.body['reasonForChange'] ? req.body['reasonForChange'] : taskChangeRequest.reasonForChange,
          taskChangeRequest.assignedTo = req.body['assignedTo'] ? req.body['assignedTo'] : taskChangeRequest.assignedTo,
          taskChangeRequest.status = req.body['status'] ? req.body['status'] : taskChangeRequest.status
  
        taskChangeRequest.save(function (err, taskChangeRequest) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating taskChangeRequest.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated taskChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "taskChangeRequest is updated", data: taskChangeRequest });
          // return res.json(taskChangeRequest);
        });
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskChangeRequestModel.deleteOne({ _id: id }, function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the taskChangeRequest.",
            error: err
          });
        }
        if(taskChangeRequest.n >0){
          const LOGMESSAGE = DATETIME + "|removed taskChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "taskChangeRequest is deleted", taskChangeRequest });
        }else{
          const LOGMESSAGE = DATETIME + "|removed taskChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }

  },
  removeByTask: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskChangeRequestModel.deleteMany({ task: id }, function (err, taskChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the taskChangeRequest.",
            error: err
          });
        }
        if (!taskChangeRequest) {
          const LOGMESSAGE = DATETIME + "|taskChangeRequest not found to delete|" + taskChangeRequest;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(taskChangeRequest.n >0){
          const LOGMESSAGE = DATETIME + "|removed taskChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "taskChangeRequest is deleted", taskChangeRequest });
        }else{
          const LOGMESSAGE = DATETIME + "|removed taskChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
  
        // return res.status(204).json();
      }); 
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting taskChangeRequest.",
        error: error
      });
    }
  },
};
