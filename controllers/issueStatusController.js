const dateFormat = require("dateformat");

const issueStatusModel = require("../models/issueStatusModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    issueStatusModel.find(function (err, issueStatus) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success:false,
          msg: "Error when getting issueStatus.",
          error: err
        });
      }
      const LOGMESSAGE = DATETIME + "|issue Status List found";
      log.write("INFO", LOGMESSAGE);
      return res.json({success:true,data:issueStatus});
    });
  },

  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var issueStatus = new issueStatusModel({
      description: req.body.description
    });

    issueStatus.save(function (err, issueStatus) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success:false,
          msg: "Error when creating issue Status",
          error: err
        });
      }
      const LOGMESSAGE = DATETIME + "|issue Status created";
      log.write("INFO", LOGMESSAGE);
      // return res.status(201).json(issue Status);
      return res.json({success:true,msg:"issue Status is created",data:issueStatus});
    });
  },

  update: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    issueStatusModel.findOne({ _id: id }, function (err, issueStatus) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success:false,
          msg: "Error when getting issue Status",
          error: err
        });
      }
      if (!issueStatus) {
        const LOGMESSAGE = DATETIME + "|No such issue Status to update";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success:false,
          msg: "No such issue Status"
        });
      }

     
      issueStatus.description = req.body.description ? req.body.description : issueStatus.description;


      issueStatus.save(function (err, projeectStatus) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when updating issue Status.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Saved issue Status";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue Status is updated",data:issueStatus});
        // return res.json(issue Status);
      });
    });
  },

  remove: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    issueStatusModel.findByIdAndRemove(id, function (err, issueStatus) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success:false,
          msg: "Error when deleting the issue Status.",
          error: err
        });
      }
        
      if (!issueStatus) {
        const LOGMESSAGE = DATETIME + "|issueStatus not found to delete|" +issueStatus;
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success: false,
          msg: "Id not found to delete"
        });
      }
      const LOGMESSAGE = DATETIME + "|removed issue Status:" + id;
      log.write("INFO", LOGMESSAGE);
      return res.json({success:true,msg:"issue Status is deleted"});
      // return res.status(204).json();
    });
  }
};
