const dateFormat = require("dateformat");

const riskRegisterModel = require("../models/riskRegisterModel");
const projectModel = require("../models/projectModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      riskRegisterModel.find(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
      }).populate('owner','username').populate('status','description').populate('project','name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  showByProject: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      riskRegisterModel.find({ project: id }).populate('owner','username').populate('status','description').populate('project','name').exec(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
        // return res.json(riskRegister);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  showByProgram: async function  (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var program = req.params.id;
      var projects = (await projectModel.find({ program }, { _id: 1 }).lean()).map((d) => d._id);
      riskRegisterModel.find({ project: {$in: projects}}).populate('owner','username').populate('status','description').populate('project','name').exec(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
        // return res.json(riskRegister);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  showByProgramRiskImpact: async function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var {programId, costImpact, timeImpact} = req.params;
      var projects = (await projectModel.find({ program:programId  }, { _id: 1 }).lean()).map((d) => d._id);
      riskRegisterModel.find({$and:[{ project: {$in: projects}}, {timeImpact: timeImpact},{costImpact: costImpact }]}).populate('owner','username').populate('status','description').populate('project','name').exec(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
        // return res.json(riskRegister);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  showByRiskImpact: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var {projectId, costImpact, timeImpact} = req.params;

      riskRegisterModel.find({$and:[{ project: projectId}, {timeImpact: timeImpact},{costImpact: costImpact }]}).populate('owner','username').populate('status','description').populate('project','name').exec(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
        // return res.json(riskRegister);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      riskRegisterModel.find({ _id: id }).populate('owner','username').populate('status','description').populate('project','name').exec(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|riskRegister Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskRegister });
        // return res.json(riskRegister);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var riskRegister = new riskRegisterModel({
        project: req.body.project,
        description: req.body.description,
        costImpact: req.body.costImpact,
        timeImpact: req.body.timeImpact,
        riskScore: req.body.riskScore,
        targetDate: req.body.targetDate,
        riskAssessment: req.body.riskAssessment,
        owner: req.body.owner,
        status: req.body.status
      });
      riskRegister.save(function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating riskRegister",
            error: err
          });
        }

        const LOGMESSAGE = DATETIME + "|riskRegister created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(riskRegister);
        return res.json({ success: true, msg: "riskRegister is created", data: riskRegister });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      riskRegisterModel.findOne({ _id: id }, function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting riskRegister",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|No such riskRegister to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such riskRegister"
          });
        }


        riskRegister.project = req.body['project'] ? req.body['project'] : riskRegister.project,
          riskRegister.description = req.body['description'] ? req.body['description'] : riskRegister.description,
          riskRegister.costImpact = req.body['costImpact'] ? req.body['costImpact'] : riskRegister.costImpact,
          riskRegister.timeImpact = req.body['timeImpact'] ? req.body['timeImpact'] : riskRegister.timeImpact,
          riskRegister.targetDate = req.body['targetDate'] ? req.body['targetDate'] : riskRegister.targetDate,
          riskRegister.owner = req.body['owner'] ? req.body['owner'] : riskRegister.owner,
          riskRegister.riskScore = req.body['riskScore'] ? req.body['riskScore'] : riskRegister.riskScore,
          riskRegister.riskAssessment = req.body['riskAssessment'],
          riskRegister.status = req.body['status'];

        riskRegister.save(function (err, riskRegister) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating riskRegister.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated riskRegister:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "riskRegister is updated", data: riskRegister });
          // return res.json(riskRegister);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      riskRegisterModel.deleteOne({ _id: id }, function (err, riskRegister) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the riskRegister.",
            error: err
          });
        }
        if (!riskRegister) {
          const LOGMESSAGE = DATETIME + "|riskRegister not found to delete|" + riskRegister;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (riskRegister.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed riskRegister:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "riskRegister is deleted", riskRegister });
        } else {
          const LOGMESSAGE = DATETIME + "|removed riskRegister:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:" + id });
        }

        const LOGMESSAGE = DATETIME + "|removed riskRegister:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "riskRegister is quality", riskRegister });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting riskRegister.",
        error: error
      });
    }

  },

};
