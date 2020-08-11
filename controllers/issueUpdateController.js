const dateFormat = require("dateformat");

const issueUpdateModel = require("../models/issueUpdateModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      issueUpdateModel.find(function (err, issueUpdate) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issueUpdate.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Update List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:issueUpdate});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueUpdate.",
        error: error
      });
    }
  
  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var issueUpdate = new issueUpdateModel({
          issue: req.body.issue,
          issueUpdateDate: req.body.issueUpdateDate,
          comment: req.body.comment,
          responsible: req.body.responsible
      });
  
      issueUpdate.save(function (err, issueUpdate) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating issue Update",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Update created";
        log.write("INFO", LOGMESSAGE);
        // return res.Update(201).json(issue Update);
        return res.json({success:true,msg:"issue Update is created",data:issueUpdate});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success:false,
        msg: "Error when getting issueUpdate.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueUpdateModel.findOne({ _id: id }, function (err, issueUpdate) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issue Update",
            error: err
          });
        }
        if (!issueUpdate) {
          const LOGMESSAGE = DATETIME + "|No such issue Update to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such issue Update"
          });
        }
  
       
        issueUpdate.issue = req.body.issue ? req.body.issue : issueUpdate.issue;
        issueUpdate.issueUpdateDate = req.body.issueUpdateDate ? req.body.issueUpdateDate : issueUpdate.issueUpdateDate;
        issueUpdate.comment = req.body.comment ? req.body.comment : issueUpdate.comment;
        issueUpdate.responsible = req.body.responsible ? req.body.responsible : issueUpdate.responsible;
  
  
        issueUpdate.save(function (err, projeectUpdate) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating issue Update.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved issue Update";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"issue Update is updated",data:issueUpdate});
          // return res.json(issue Update);
        });
      });     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueUpdate.",
        error: error
      });
    }
 
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueUpdateModel.findByIdAndRemove(id, function (err, issueUpdate) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the issue Update.",
            error: err
          });
        }
        if (!issueUpdate) {
          const LOGMESSAGE = DATETIME + "|issueUpdate not found to delete|" +issueUpdate;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue Update:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue Update is deleted"});
        // return res.Update(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when removing issueUpdate.",
        error: error
      });
    }

  }
};
