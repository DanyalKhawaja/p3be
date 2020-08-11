const dateFormat = require("dateformat");

const issueTypeModel = require("../models/issueTypeModel");
const issueInitiationLogModel = require("../models/issueInitiationLogModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      issueTypeModel.find(function (err, issueType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issueType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:issueType});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issueType.",
            error: error
          });
    }
   
  },

  listByProject: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueInitiationLogModel.find({project:id},function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting issueType.",
            error: err
          });
        }
      
        if(issueInitiationLog){
          var issueInitiationLogArr = [];
          issueInitiationLog.forEach(
            function(row) {
              issueInitiationLogArr.push(row.issueType);
            });
            console.log(issueInitiationLogArr)
            issueTypeModel.find({_id:issueInitiationLogArr},function (err, issueType) {
              if (err) {
                const LOGMESSAGE = DATETIME + "|" + err.message;
                log.write("ERROR", LOGMESSAGE);
                return res.status(500).json({
                  success:false,
                  msg: "Error when getting issueType.",
                  error: err
                });
              }
              if(issueType){
                const LOGMESSAGE = DATETIME + "|issue Type List found";
                log.write("INFO", LOGMESSAGE);
                return res.json({success:true,data:issueType});
              }
  
            });
  
        }
  
      });
      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting issueType.",
        error: error
      });
    }

  
  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var issueType = new issueTypeModel({
        description: req.body.description
      });
  
      issueType.save(function (err, issueType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating issue Type",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Type created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(issue Type);
        return res.json({success:true,msg:"issue Type is created",data:issueType});
      }); 
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success:false,
        msg: "Error when creating issue Type",
        error: error
      });
    }
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueTypeModel.findByIdAndRemove(id, function (err, issueType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the issue Type.",
            error: err
          });
        }
        if (!issueType) {
          const LOGMESSAGE = DATETIME + "|issueType not found to delete|" +issueType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue Type is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success:false,
        msg: "Error when updating issue Type",
        error: error
      });
    }
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    issueTypeModel.findOne({ _id: id }, function (err, issueType) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success:false,
          msg: "Error when getting issue Type",
          error: err
        });
      }
      if (!issueType) {
        const LOGMESSAGE = DATETIME + "|No such issue Type to update";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success:false,
          msg: "No such issue Type"
        });
      }

     
      issueType.description = req.body.description ? req.body.description : issueType.description;


      issueType.save(function (err, projeectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when updating issue Type.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Saved issue Type";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue Type is updated",data:issueType});
        // return res.json(issue Type);
      });
    });
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueTypeModel.findByIdAndRemove(id, function (err, issueType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the issue Type.",
            error: err
          });
        }
        if (!issueType) {
          const LOGMESSAGE = DATETIME + "|issueType not found to delete|" +issueType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"issue Type is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success:false,
        msg: "Error when removing issue Type",
        error: error
      });
    }

  }
};
