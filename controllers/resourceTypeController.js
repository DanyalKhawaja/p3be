const dateFormat = require("dateformat");

const resourceTypeModel = require("../models/resourceTypeModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceTypeModel.find(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting resourceType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resourceType });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var resourceType = new resourceTypeModel({
        description: req.body.description,
        resourceSubTypeId: req.body.resourceSubTypeId
      });

      resourceType.save(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Type",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource Type created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Resource Type);
        return res.json({ success: true, msg: "Resource Type is created", data: resourceType });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceTypeModel.findOne({ _id: id }, function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Resource Type",
            error: err
          });
        }
        if (!resourceType) {
          const LOGMESSAGE = DATETIME + "|No such Resource Type to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such Resource Type"
          });
        }


        resourceType.description = req.body.description ? req.body.description : resourceType.description;
        resourceType.resourceSubTypeId = req.body.resourceSubTypeId ? req.body.resourceSubTypeId : resourceType.resourceSubTypeId;

        resourceType.save(function (err, projeectType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating Resource Type.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved Resource Type";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "Resource Type is updated", data: resourceType });
          // return res.json(Resource Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceTypeModel.findByIdAndRemove(id, function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the Resource Type.",
            error: err
          });
        }
        if (!resourceType) {
          const LOGMESSAGE = DATETIME + "|" + resourceType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Reource type not found to delete"
          });
        }
        console.log(resourceType)
        const LOGMESSAGE = DATETIME + "|removed Resource Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "Resource Type is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  }
};
