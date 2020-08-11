const dateFormat = require("dateformat");

const projectTypeModel = require("../models/projectTypeModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      projectTypeModel.find(function (err, projectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting ProjectType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Project Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectType});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ProjectType.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var projectType = new projectTypeModel({
        description: req.body.description
      });
  
      projectType.save(function (err, projectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating Project Type",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Project Type created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Project Type);
        return res.json({success:true,msg:"Project Type is created",data:projectType});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ProjectType.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectTypeModel.findOne({ _id: id }, function (err, projectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting Project Type",
            error: err
          });
        }
        if (!projectType) {
          const LOGMESSAGE = DATETIME + "|No such Project Type to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such Project Type"
          });
        }
  
       
        projectType.description = req.body.description ? req.body.description : projectType.description;
  
  
        projectType.save(function (err, projeectType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating Project Type.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved Project Type";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"Project Type is updated",data:projectType});
          // return res.json(Project Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ProjectType.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectTypeModel.findByIdAndRemove(id, function (err, projectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the Project Type.",
            error: err
          });
        }
        if (!projectType) {
          const LOGMESSAGE = DATETIME + "|projectType not found to delete|" +projectType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed Project Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"Project Type is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ProjectType.",
        error: error
      });
    }

  }
};
