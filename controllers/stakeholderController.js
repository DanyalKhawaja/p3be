const dateFormat = require("dateformat");
var ObjectId = require('mongoose').Types.ObjectId;
const stakeholderModel = require("../models/stakeholderModel");
const programModel = require("../models/programModel");
const projectModel = require("../models/projectModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      stakeholderModel.find(function (err, stakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting stakeholder.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|stakeholder List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: stakeholder });
      }).populate('role', 'name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },

  show: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {

      var id = req.params.id;

      stakeholderModel.find({ project: ObjectId(id) }).populate('role', 'name').exec(function (err, stakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting stakeholder.",
            error: err
          });
        }
        if (!stakeholder) {
          const LOGMESSAGE = DATETIME + "|No such stakeholder:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such stakeholder:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|stakeholder Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: stakeholder });
        // return res.json(stakeholder);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },
  showByProgram: async function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var program = ObjectId(req.params.id);
      let projects = (await projectModel.find({ program }).lean()).map((d) => d._id);
      stakeholderModel.find({ project: { $in: projects } }).populate('project', 'name').populate('role', 'name').lean().exec(function (err, stakeholders) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting stakeholder.",
            error: err
          });
        }
        if (!stakeholders) {
          const LOGMESSAGE = DATETIME + "|No such program:" + program;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program:" + program
          });
        }
        const LOGMESSAGE = DATETIME + "|stakeholder Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: { stakeholders } });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }
  },

  showByPortfolio: async function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var portfolio = ObjectId(req.params.id);
      let programsData = await programModel.find({ portfolio }).lean();
      let programs = programsData.map((d) => d._id);
      let programsList = programsData.reduce((ob, program) => {
        ob[program._id] = program.name;
        return ob;
      }, {});
      let projectsData = await projectModel.find({ program: { $in: programs } }).lean();
      let projects = projectsData.map((d) => d._id);
      let projectsList = projectsData.reduce((ob, project) => {
        ob[project._id] = { name: project.name, programId: project.program, programName: programsList[project.program] };
        return ob;
      }, {});

      stakeholderModel.find({ project: { $in: projects } }).populate('role', 'name').exec(function (err, stakeholders) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting stakeholder.",
            error: err
          });
        }
        if (!stakeholders) {
          const LOGMESSAGE = DATETIME + "|No such portfolio:" + portfolio;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolio:" + portfolio
          });
        }
        const LOGMESSAGE = DATETIME + "|stakeholder Found";
        log.write("INFO", LOGMESSAGE);
        let programsList = programsData.map((d) => ({ id: d._id, name: d.name }));
        return res.json({ success: true, data: { programsList, projectsList, stakeholders } });
        // return res.json(stakeholder);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var stakeholder = new stakeholderModel({
        project: req.body.project,
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        levelSupportRequired: req.body.levelSupportRequired,
        levelSupportProvided: req.body.levelSupportProvided,
        impact: req.body.impact,
        riskRating: Number(req.body.impact) * Number(req.body.levelSupportRequired),
        issues: req.body.issues,
        feedback: req.body.feedback,
        influenceStrategy: req.body.influenceStrategy,
        createdBy: req.body.createdBy
      });

      stakeholder.save(function (err, stakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|stakeholder created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(stakeholder);
        return res.json({ success: true, msg: "stakeholder is created", data: stakeholder });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      stakeholderModel.findOne({ _id: id }, function (err, stakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting stakeholder",
            error: err
          });
        }
        if (!stakeholder) {
          const LOGMESSAGE = DATETIME + "|No such stakeholder to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such stakeholder"
          });
        }

        stakeholder.project = req.body['project'] ? req.body['project'] : stakeholder.project,
          stakeholder.role = req.body['role'] ? req.body['role'] : stakeholder.role,
          stakeholder.name = req.body['name'] ? req.body['name'] : stakeholder.name,
          stakeholder.email = req.body['email'] ? req.body['email'] : stakeholder.email,
          stakeholder.phoneNo = req.body['phoneNo'] ? req.body['phoneNo'] : stakeholder.phoneNo,
          stakeholder.levelSupportRequired = req.body['levelSupportRequired'] ? req.body['levelSupportRequired'] : stakeholder.levelSupportRequired,
          stakeholder.levelSupportProvided = req.body['levelSupportProvided'] ? req.body['levelSupportProvided'] : stakeholder.levelSupportProvided,
          stakeholder.impact = req.body['impact'] ? req.body['impact'] : stakeholder.impact,
          stakeholder.riskRating = req.body['riskRating'] ? req.body['riskRating'] : stakeholder.riskRating,
          stakeholder.issues = req.body['issues'] ? req.body['issues'] : stakeholder.issues,
          stakeholder.feedback = req.body['feedback'] ? req.body['feedback'] : stakeholder.feedback,
          stakeholder.influenceStrategy = req.body['influenceStrategy'] ? req.body['influenceStrategy'] : stakeholder.influenceStrategy


        stakeholder.save(function (err, stakeholder) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating stakeholder.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated stakeholder:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "stakeholder is updated", data: stakeholder });
          // return res.json(stakeholder);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      stakeholderModel.deleteOne({ _id: id }, function (err, stakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the stakeholder.",
            error: err
          });
        }
        if (!stakeholder) {
          const LOGMESSAGE = DATETIME + "|stakeholder not found to delete|" + stakeholder;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (stakeholder.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed stakeholder:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "stakeholder is deleted", stakeholder });
        } else {
          const LOGMESSAGE = DATETIME + "|removed stakeholder:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:" + id });
        }
        // const LOGMESSAGE = DATETIME + "|removed stakeholder:" + id;
        // log.write("INFO", LOGMESSAGE);
        // return res.json({success:true,msg:"stakeholder is deleted", stakeholder});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting stakeholder.",
        error: error
      });
    }

  },

};
