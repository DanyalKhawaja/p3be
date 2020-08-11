const dateFormat = require("dateformat");

const resourceChangeRequestModel = require("../models/resourceChangeRequestModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
      try {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var id = req.params.id;
    
        resourceChangeRequestModel.find({taskChangeRequest:id },function (err, resourceChangeRequest) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when getting resourceChangeRequest.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|resourceChangeRequest List found";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,data:resourceChangeRequest});
        });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
     
      resourceChangeRequestModel.find({ _id: id}).exec(function (err, resourceChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting resourceChangeRequest.",
            error: err
          });
        }
        if (!resourceChangeRequest) {
          const LOGMESSAGE = DATETIME + "|No such resourceChangeRequest:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such resourceChangeRequest:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|resourceChangeRequest Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:resourceChangeRequest});
        // return res.json(resourceChangeRequest);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      // var resourceChangeRequest = new resourceChangeRequestModel({
  
      // task:req.body.task,
      // project: req.body.project,
      // taskPlannedResource: req.body.taskPlannedResource,
      // resource: req.body.resource,
      // quantity: req.body.quantity,
      // costPerUnit: req.body.costPerUnit         
      // });
      // var resourceChangeRequest = new resourceChangeRequestModel(req.body);
      resourceChangeRequestModel.create(req.body,function (err, resourceChangeRequest) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating Resource Change Request",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|resourceChangeRequest created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(resourceChangeRequest);
        return res.json({success:true,msg:"resourceChangeRequest is created",data:resourceChangeRequest});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

  },

  updateTask: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {
        // console.log(element)
        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when getting task",
              error: err
            });
          }
          if (!task) {
            const LOGMESSAGE = DATETIME + "|No such task to update:"+element._id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success:false,
              msg: "No such task with id"+element._id
            });
          }
          // console.log(req.body)
          console.log(element.project)
  
          task.project= element.project?element.project :task.project;
          task.parentTask= element.parentTask?element.parentTask : task.parentTask;
          task.description= element.description?element.description :task.description;
          task.plannedStartDate= element.plannedStartDate?element.plannedStartDate :task.plannedStartDate;
          task.plannedEndDate=element.plannedEndDate?element.plannedEndDate : task.plannedEndDate;
          task.workPackage=element.workPackage?element.workPackage: task.workPackage;
          task.plannedCost=element.plannedCost?element.plannedCost: task.plannedCost;
          task.milestone= element.milestone?element.milestone : task.milestone;
          task.updatedDate= DATETIME;
          task.updatedBy= element.updatedBy? element.updatedBy:task.updatedBy;
          // console.log(task)
          task.save(function (err, task) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success:false,
                msg: "Error when updating task.",
                error: err
              });
            }
            if(index == arrBody.length-1){
              const LOGMESSAGE = DATETIME + "|Updated task:"+id;
              log.write("INFO", LOGMESSAGE);
              return res.json({success:true,msg:"task list is updated"});
            }
            // return res.json(task);
          });
        });
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

 
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {
      resourceChangeRequestModel.findOne({ _id: element._id }, function (err, resourceChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting resourceChangeRequest",
            error: err
          });
        }
   
        if (!resourceChangeRequest) {
          const LOGMESSAGE = DATETIME + "|No such resourceChangeRequest to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such resourceChangeRequest"
          });
        }
      
        resourceChangeRequest.task= element['task']?element['task'] : resourceChangeRequest.task,
        resourceChangeRequest.project= element['project']?element['project'] :resourceChangeRequest.project,
        resourceChangeRequest.taskPlannedResource= element['taskPlannedResource'],
        resourceChangeRequest.resource= element['resource']?element['resource'] : resourceChangeRequest.resource,
        resourceChangeRequest.quantity= element['quantity']?element['quantity'] : resourceChangeRequest.quantity,
        resourceChangeRequest.costPerUnit= element['costPerUnit']?element['costPerUnit'] : resourceChangeRequest.costPerUnit
  
        resourceChangeRequest.save(function (err, resourceChangeRequest) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating resourceChangeRequest.",
              error: err
            });
          }
          if(index == arrBody.length-1){
            const LOGMESSAGE = DATETIME + "|Updated resourceChangeRequest:"+id;
            log.write("INFO", LOGMESSAGE);
            return res.json({success:true,msg:"resourceChangeRequest is updated",data:resourceChangeRequest});
          }
          // return res.json(resourceChangeRequest);
        });
      });
    });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceChangeRequestModel.deleteMany({taskChangeRequest:id }, function (err, resourceChangeRequest) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the resourceChangeRequest.",
            error: err
          });
        }
  
        if(resourceChangeRequest.n >0){
          const LOGMESSAGE = DATETIME + "|removed resourceChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "resourceChangeRequest is deleted", resourceChangeRequest });
        }else{
          const LOGMESSAGE = DATETIME + "|removed resourceChangeRequest:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
  
        // const LOGMESSAGE = DATETIME + "|removed resourceChangeRequest:" + id;
        // log.write("INFO", LOGMESSAGE);
        // return res.json({success:true,msg:"resourceChangeRequest is deleted", resourceChangeRequest});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resourceChangeRequest.",
        error: error
      });
    }

  },

};
