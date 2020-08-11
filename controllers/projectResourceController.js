const dateFormat = require("dateformat");

const projectResourceModel = require("../models/projectResourceModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      projectResourceModel.find(function (err, projectResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting projectResource.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|projectResource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectResource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting projectResource.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
     
      projectResourceModel.find({ project: id}).exec(function (err, projectResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting projectResource.",
            error: err
          });
        }
        if (!projectResource) {
          const LOGMESSAGE = DATETIME + "|No such projectResource:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such projectResource:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|projectResource Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectResource});
        // return res.json(projectResource);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting projectResource.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var projectResource = new projectResourceModel({
  
  
      project: req.body.project,
      resource: req.body.resource,
            
      });
   
      projectResourceModel.create(req.body,function (err, projectResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating projectResource",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|projectResource created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(projectResource);
        return res.json({success:true,msg:"projectResource is created",data:projectResource});
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting projectResource.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectResourceModel.findOne({ _id: id }, function (err, projectResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting projectResource",
            error: err
          });
        }
        if (!projectResource) {
          const LOGMESSAGE = DATETIME + "|No such projectResource to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such projectResource"
          });
        }
  
        projectResource.project= req.body['project']?req.body['project'] :projectResource.project,
        projectResource.resource= req.body['resource']?req.body['resource'] : projectResource.resource,
   
        projectResource.save(function (err, projectResource) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating projectResource.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated projectResource:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"projectResource is updated",data:projectResource});
          // return res.json(projectResource);
        });
      });     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting projectResource.",
        error: error
      });
    }
 
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var projectId = req.params.projectId;
      projectResourceModel.deleteMany({resource :id, project:projectId}, function (err, projectResource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the projectResource.",
            error: err
          });
        }
        if (!projectResource) {
          const LOGMESSAGE = DATETIME + "|projectResource not found to delete|" +projectResource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed projectResource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"projectResource is deleted", projectResource});
        // return res.status(204).json();
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting projectResource.",
        error: error
      });
    }

  },

};
