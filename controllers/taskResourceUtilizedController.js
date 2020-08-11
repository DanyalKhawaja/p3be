const dateFormat = require("dateformat");

const taskResourceUtilizedModel = require("../models/taskResourceUtilizedModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskResourceUtilizedModel.find(function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting taskResourceUtilized.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskResourceUtilized List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:taskResourceUtilized});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }
  
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var taskId = req.params.taskId;
      taskResourceUtilizedModel.find({ project: id,task:taskId }).exec(function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting taskResourceUtilized.",
            error: err
          });
        }
        if (!taskResourceUtilized) {
          const LOGMESSAGE = DATETIME + "|No such taskResourceUtilized:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such taskResourceUtilized:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|taskResourceUtilized Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:taskResourceUtilized});
        // return res.json(taskResourceUtilized);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }

  },
  showTaskByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskResourceUtilizedModel.findOne({ project: id }, function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting taskResourceUtilized.",
            error: err
          });
        }
        if (!taskResourceUtilized) {
          const LOGMESSAGE = DATETIME + "|NO Such taskResourceUtilized of project:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such taskResourceUtilized"
          });
        }
        const LOGMESSAGE = DATETIME + "|taskResourceUtilized found of project:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:taskResourceUtilized});
        // return res.json(taskResourceUtilized);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }

  },

  
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var taskResourceUtilized = new taskResourceUtilizedModel({
      project: req.body.project,
      task: req.body.task,
      resource: req.body.resource,
      monitoring: req.body.monitoring,
      quantity: req.body.quantity,
      actualCostPerUnit:req.body.actualCostPerUnit,
    
            
      });
  
      taskResourceUtilized.save(function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating taskResourceUtilized",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|taskResourceUtilized created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(taskResourceUtilized);
        return res.json({success:true,msg:"taskResourceUtilized is created",data:taskResourceUtilized});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
    
      taskResourceUtilizedModel.findOne({ _id: id }, function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting taskResourceUtilized",
            error: err
          });
        }
        if (!taskResourceUtilized) {
          const LOGMESSAGE = DATETIME + "|No such taskResourceUtilized to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such taskResourceUtilized"
          });
        }
        taskResourceUtilized.project= req.body.project?req.body.project :taskResourceUtilized.project,
        taskResourceUtilized.task= req.body.task?req.body.task : taskResourceUtilized.task,
        taskResourceUtilized.resource= req.body.resource?req.body.resource :taskResourceUtilized.resource,
        taskResourceUtilized.monitoring= req.body.monitoring?req.body.monitoring :taskResourceUtilized.monitoring,
        taskResourceUtilized.quantity= req.body.quantity?req.body.quantity :taskResourceUtilized.quantity ,
        taskResourceUtilized.actualCostPerUnit=req.body.actualCostPerUnit?req.body.actualCostPerUnit : taskResourceUtilized.actualCostPerUnit,
  
        taskResourceUtilized.save(function (err, taskResourceUtilized) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating taskResourceUtilized.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated taskResourceUtilized:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"taskResourceUtilized is updated",data:taskResourceUtilized});
          // return res.json(taskResourceUtilized);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var taskId = req.params.taskId
      taskResourceUtilizedModel.deleteMany({project:id, task:taskId}, function (err, taskResourceUtilized) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the taskResourceUtilized.",
            error: err
          });
        }
        if (!taskResourceUtilized) {
          const LOGMESSAGE = DATETIME + "|taskResourceUtilized not found to delete|" +taskResourceUtilized;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed taskResourceUtilized:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"taskResourceUtilized is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting taskResourceUtilized.",
        error: error
      });
    }
 
  }
};
