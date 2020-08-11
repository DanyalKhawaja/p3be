const dateFormat = require("dateformat");

const programComponentModel = require("../models/programComponentModel");
const componentMilestoneModel = require("../models/componentMilestoneModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programComponentModel.find(function (err, programComponent) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programComponent.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programComponent List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: programComponent });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programComponent.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      programComponentModel.find({ program: id }).exec(function (err, programComponent) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programComponent.",
            error: err
          });
        }
        if (!programComponent) {
          const LOGMESSAGE = DATETIME + "|No such programComponent:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such programComponent:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|programComponent Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: programComponent });
        // return res.json(programComponent);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programComponent.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      var programComponent = new programComponentModel({
        program: req.body.program,
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdDate: req.body.createdDate,
        createdBy: req.body.createdBy,
      });
      programComponent.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
        name: milestone.name,
        startDate: milestone.startDate,
        endDate: milestone.endDate,
        createdBy: milestone.createdBy
      })));
      
      programComponent.save(function (err, programComponent) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programComponent created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(programComponent);
        return res.json({ success: true, msg: "programComponent is created", data: programComponent });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programComponent.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programComponentModel.findOne({ _id: id }, function (err, programComponent) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programComponent",
            error: err
          });
        }
        if (!programComponent) {
          const LOGMESSAGE = DATETIME + "|No such programComponent to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such programComponent"
          });
        }
        programComponent.program = req.body['program'] ? req.body['program'] : programComponent.program,
          programComponent.name = req.body['name'] ? req.body['name'] : programComponent.name,
          programComponent.startDate = req.body['startDate'] ? req.body['startDate'] : programComponent.startDate,
          programComponent.endDate = req.body['endDate'] ? req.body['endDate'] : programComponent.endDate
          programComponent.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
            name: milestone.name,
            startDate: milestone.startDate,
            endDate: milestone.endDate,
            createdBy: milestone.createdBy
          })));
        programComponent.save(function (err, programComponent) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating programComponent.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated programComponent:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programComponent is updated", data: programComponent });
          // return res.json(programComponent);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programComponent.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programComponentModel.deleteOne({ _id: id }, function (err, programComponent) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the programComponent.",
            error: err
          });
        }
        if (!programComponent) {
          const LOGMESSAGE = DATETIME + "|programComponent not found to delete|" + programComponent;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }

        if (programComponent.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed programComponent:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programComponent is deleted", programComponent });
        } else {
          const LOGMESSAGE = DATETIME + "|removed programComponent:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:" + id });
        }

        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programComponent.",
        error: error
      });
    }

  },

};
