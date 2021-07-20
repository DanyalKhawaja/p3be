const dateFormat = require("dateformat");
const programBenefitMonitoringModel = require("../models/programBenefitMonitoringModel");
const projectModel = require("../models/projectModel");
const programBenefitModel = require("../models/programBenefitModel");
const log = require('../lib/logger');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programBenefitMonitoringModel.find(function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programBenefitMonitoring.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefitMonitoring List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: programBenefitMonitoring });
      }).populate('assessmentBy', 'username').populate('benefit', 'description');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      programBenefitMonitoringModel.find({ benefit: id }).populate('assessmentBy', 'username').populate('benefit', 'description').exec(function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programBenefitMonitoring.",
            error: err
          });
        }
        if (!programBenefitMonitoring) {
          const LOGMESSAGE = DATETIME + "|No such programBenefitMonitoring:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such programBenefitMonitoring:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefitMonitoring Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: programBenefitMonitoring });
        // return res.json(programBenefitMonitoring);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },
  showByBenefit: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      programBenefitMonitoringModel.find({ benefit: id }).populate('assessmentBy', 'username').populate('benefit', 'description').exec(function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programBenefitMonitoring.",
            error: err
          });
        }
        if (!programBenefitMonitoring) {
          const LOGMESSAGE = DATETIME + "|No such programBenefitMonitoring:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such programBenefitMonitoring:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefitMonitoring Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: programBenefitMonitoring });
        // return res.json(programBenefitMonitoring);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },
  showByProgram: async function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
       let benefits = await programBenefitModel.find({ program: id }, { description: 1, value: 1 }).lean();
      let benefitsMap = benefits.reduce((obj, row) => {
        obj[row._id] = {};
        obj[row._id].description = row.description;
        obj[row._id].expectedValue = row.value;
        return obj;
      }, {});
      let benefitsTotal = (await programBenefitMonitoringModel
        .aggregate([{ $match: { benefit: { $in: benefits.map(doc => doc._id) } } }, { $group: { _id: "$benefit", received: { $sum: "$benefitValue" } } }]))
        .reduce((obj, row) => {
          obj[row._id] = { description: benefitsMap[row._id].description, expectedValue: benefitsMap[row._id].expectedValue, received: row.received };
          return obj;
        }, {});
      benefits.forEach(doc => {
        if (!benefitsTotal[doc._id])
          benefitsTotal[doc._id] = { description: doc.description, expectedValue: doc.value, received: 0 };
      });
      const LOGMESSAGE = DATETIME + "|programBenefitMonitoring Found";
      log.write("INFO", LOGMESSAGE);
      return res.json({ success: true, data: benefitsTotal });
    }
    catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var programBenefitMonitoring = new programBenefitMonitoringModel({
        benefit: req.body.benefit,
        benefitFrom: req.body.benefitFrom,
        benefitDuration: req.body.benefitDuration,
        benefitValue: req.body.benefitValue,
        explanation: req.body.explanation,
        assessmentBy: req.body.assessmentBy,
        createdDate: DATETIME,
        createdBy: req.body.createdBy
      });

      programBenefitMonitoring.save(function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefitMonitoring created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(programBenefitMonitoring);
        return res.json({ success: true, msg: "programBenefitMonitoring is created", data: programBenefitMonitoring });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programBenefitMonitoringModel.findOne({ _id: id }, function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting programBenefitMonitoring",
            error: err
          });
        }
        if (!programBenefitMonitoring) {
          const LOGMESSAGE = DATETIME + "|No such programBenefitMonitoring to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such programBenefitMonitoring"
          });
        }

        programBenefitMonitoring.benefit = req.body['benefit'] ? req.body['benefit'] : programBenefitMonitoring.benefit,
          programBenefitMonitoring.benefitFrom = req.body['benefitFrom'] ? req.body['benefitFrom'] : programBenefitMonitoring.benefitFrom,
          programBenefitMonitoring.benefitDuration = req.body['benefitDuration'] ? req.body['benefitDuration'] : programBenefitMonitoring.benefitDuration,
          programBenefitMonitoring.benefitValue = req.body['benefitValue'] ? req.body['benefitValue'] : programBenefitMonitoring.benefitValue,
          programBenefitMonitoring.explanation = req.body['explanation'] ? req.body['explanation'] : programBenefitMonitoring.explanation,
          programBenefitMonitoring.assessmentBy = req.body['assessmentBy'] ? req.body['assessmentBy'] : programBenefitMonitoring.assessmentBy
        programBenefitMonitoring.save(function (err, programBenefitMonitoring) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating programBenefitMonitoring.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated programBenefitMonitoring:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programBenefitMonitoring is updated", data: programBenefitMonitoring });
          // return res.json(programBenefitMonitoring);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programBenefitMonitoringModel.deleteOne({ _id: id }, function (err, programBenefitMonitoring) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the programBenefitMonitoring.",
            error: err
          });
        }
        if (!programBenefitMonitoring) {
          const LOGMESSAGE = DATETIME + "|programBenefitMonitoring not found to delete|" + programBenefitMonitoring;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (programBenefitMonitoring.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed programBenefitMonitoring:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programBenefitMonitoring is deleted", programBenefitMonitoring });
        } else {
          const LOGMESSAGE = DATETIME + "|removed programBenefitMonitoring:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:" + id });
        }
        // const LOGMESSAGE = DATETIME + "|removed programBenefitMonitoring:" + id;
        // log.write("INFO", LOGMESSAGE);
        // return res.json({success:true,msg:"programBenefitMonitoring is deleted", programBenefitMonitoring});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programBenefitMonitoring.",
        error: error
      });
    }

  },

};
