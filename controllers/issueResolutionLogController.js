const dateFormat = require("dateformat");

const issueResolutionLogModel = require("../models/issueResolutionLogModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      issueResolutionLogModel.find(function (err, issueResolutionLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issueResolutionLog.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue ResolutionLog List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:issueResolutionLog});
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueResolutionLog.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var issueResolutionLog = new issueResolutionLogModel({
          issue: req.body.issue,
          responsibleForResolution: req.body.responsibleForResolution,
          issueType: req.body.issueType,
          priority: req.body.priority,
          status: req.body.status,
          deliveryEstimate: req.body.deliveryEstimate,
          createDate: req.body.createDate,
          createdBy: req.body.createdBy
      });
  
      issueResolutionLog.save(function (err, issueResolutionLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating issue ResolutionLog",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue ResolutionLog created";
        log.write("INFO", LOGMESSAGE);
        // return res.ResolutionLog(201).json(issue ResolutionLog);
        return res.json({success:true,msg:"issue ResolutionLog is created",data:issueResolutionLog});
      }); 
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueResolutionLog.",
        error: error
      });
    }
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueResolutionLogModel.findOne({ _id: id }, function (err, issueResolutionLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issue ResolutionLog",
            error: err
          });
        }
        if (!issueResolutionLog) {
          const LOGMESSAGE = DATETIME + "|No such issue ResolutionLog to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such issue ResolutionLog"
          });
        }
  
       
        issueResolutionLog.responsibleForResolution = req.body.responsibleForResolution ? req.body.responsibleForResolution : issueResolutionLog.responsibleForResolution;
        issueResolutionLog.issueType = req.body.issueType ? req.body.issueType : issueResolutionLog.issueType;
        issueResolutionLog.priority = req.body.priority ? req.body.priority : issueResolutionLog.priority;
        issueResolutionLog.status = req.body.status ? req.body.status : issueResolutionLog.status;
        issueResolutionLog.deliveryEstimate = req.body.deliveryEstimate ? req.body.deliveryEstimate : issueResolutionLog.deliveryEstimate;
        issueResolutionLog.createDate = req.body.createDate ? req.body.createDate : issueResolutionLog.createDate;
        issueResolutionLog.createdBy = req.body.createdBy ? req.body.createdBy : issueResolutionLog.createdBy;
  
  
        issueResolutionLog.save(function (err, projeectResolutionLog) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating issue ResolutionLog.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved issue ResolutionLog";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"issue ResolutionLog is updated",data:issueResolutionLog});
          // return res.json(issue ResolutionLog);
        });
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueResolutionLog.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueResolutionLogModel.findByIdAndRemove(id, function (err, issueResolutionLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the issue ResolutionLog.",
            error: err
          });
        }
        if (!issueResolutionLog) {
          const LOGMESSAGE = DATETIME + "|issueResolutionLog not found to delete|" +issueResolutionLog;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue ResolutionLog:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue ResolutionLog is deleted"});
        // return res.ResolutionLog(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueResolutionLog.",
        error: error
      });
    }

  }
};
