const dateFormat = require("dateformat");

const resourceModel = require("../models/resourceModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceModel.find(function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting resource.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:resource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findOne({ _id: id }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting resource.",
            error: err
          });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such resource"
          });
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  },
  showByResourceTypeId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findOne({ resourceType: id }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting resource.",
            error: err
          });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such resource "
          });
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var resource = new resourceModel({
          resourceType: req.body.resourceType,
          resourceName: req.body.resourceName,
          resourceUnit: req.body.resourceUnit,
          calendarType: req.body.calendarType,
          available: req.body.available
      });
  
      resource.save(function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating Resource",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Resource Type);
        return res.json({success:true,msg:"Resource is created",data:resource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findOne({ _id: id }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting Resource ",
            error: err
          });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such Resource  to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such Resource "
          });
        }
  
        resource.resourceType = req.body.resourceType ? req.body.resourceType : resource.resourceType;
        resource.resourceName = req.body.resourceName ? req.body.resourceName : resource.resourceName;
        resource.resourceUnit = req.body.resourceUnit ? req.body.resourceUnit : resource.resourceUnit;
        resource.calendarType = req.body.calendarType ? req.body.calendarType : resource.calendarType;
        resource.available = req.body.available ? req.body.available : resource.available;
          
  
        resource.save(function (err, projeectType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating Resource .",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved Resource ";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"Resource  is updated",data:resource});
          // return res.json(Resource Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findByIdAndRemove(id, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the Resource.",
            error: err
          });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|resource not found to delete|" +resource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed Resource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"Resource is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting resource.",
        error: err
      });
    }

  }
};
