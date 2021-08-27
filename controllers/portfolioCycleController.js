const dateFormat = require("dateformat");

var ObjectId = require('mongoose').Types.ObjectId;
const portfolioCycleModel = require("../models/portfolioCycleModel");
const log = require('../lib/logger');
const programModel = require("../models/programModel");
const taskModel = require("../models/taskModel");
module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      portfolioCycleModel.find(function (err, portfolioCycle) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolioCycle.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolioCycleList found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolioCycle});
      }).populate('manager', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  },

  showByPortfolioCycleId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioCycleModel.findOne({ _id: id }).populate('manager', 'username').populate('portfolio').exec(function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolioCycle.",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|No such portfolioCycle";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolioCycle"
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolioCycleFound";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolioCycle});
        // return res.json(portfolio);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  },
  showByPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioCycleModel.find({ portfolio: ObjectId(id) },function (err, portfolioCycle) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolioCycle.",
            error: err
          });
        }
        if (!portfolioCycle) {
          const LOGMESSAGE = DATETIME + "|No such portfolioCycle";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolioCycle"
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolioCycleFound";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolioCycle});

      }).populate('manager', 'username').populate('portfolio','name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  },

  showPortfolioCyclePrograms: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programModel.find({ portfolio: ObjectId(req.params.portfolioId) }, function (err, staticPrograms) {

        if (staticPrograms.length == 0) return res.json({ success: true, data: [] });
        let programs = staticPrograms.map(d => ObjectId(d._id));

        let query = [{ $match: { workPackage: true, "plannedStartDate": { $gte: new Date(req.params.startDate) }, "plannedEndDate": { $lte: new Date(req.params.endDate) } } }, { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'Project' } }, { $unwind: { path: "$Project" } }, { $lookup: { from: 'programs', localField: 'Project.program', foreignField: '_id', as: 'Program' } }, { $unwind: { path: "$Program" } }, { $match: { 'Program._id': { $in: programs } } },
        { $group: { _id: "$Program._id", plannedTotal: { $sum: "$plannedCost" }, actualTotal: { $sum: "$actualCost" } } }]
        taskModel.aggregate(query, function (err, summary) {
          let programsMap = summary.reduce((t, p) => {
            t[p._id] = p;
            return t;
          }, {})
          portfolioCycleModel.findById(req.params.portfolioCycleId, function (err, data) {
            if (data) {
              let programs = data.programs.map(d => d.toString());
              staticPrograms.forEach((d, i) => {
                staticPrograms[i].plannedTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].plannedTotal : 0;
                staticPrograms[i].actualTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].actualTotal : 0;
                if (programs.includes(d._id.toString())) {
                  staticPrograms[i].checked = true;

                }
              })
            }


            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when getting portfolioCycle.",
                error: err
              });
            }
            if (!staticPrograms) {
              const LOGMESSAGE = DATETIME + "|No such programs";
              log.write("ERROR", LOGMESSAGE);
              return res.status(404).json({
                success: false,
                msg: "No such programs"
              });
            }
            const LOGMESSAGE = DATETIME + "|programs Found";
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, data: staticPrograms });
          }).lean();
        });
      }).lean();
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting programs.",
        error: error
      });
    }

  },

  showPortfolioStaticPrograms: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    programModel.find({ portfolio: ObjectId(req.params.portfolioId) }, function (err, staticPrograms) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success: false,
          msg: "Error when getting portfolioCycle.",
          error: err
        });
      }
      if (!staticPrograms) {
        const LOGMESSAGE = DATETIME + "|No such programs";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success: false,
          msg: "No such programs"
        });
      }

      let programs = staticPrograms.map(d => ObjectId(d._id));

      let query = [{ $match: { workPackage: true, "plannedStartDate": { $gte: new Date(req.params.startDate) }, "plannedEndDate": { $lte: new Date(req.params.endDate) } } }, { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'Project' } }, { $unwind: { path: "$Project" } }, { $lookup: { from: 'programs', localField: 'Project.program', foreignField: '_id', as: 'Program' } }, { $unwind: { path: "$Program" } }, { $match: { 'Program._id': { $in: programs } } },
      { $group: { _id: "$Program._id", plannedTotal: { $sum: "$plannedCost" }, actualTotal: { $sum: "$actualCost" } } }]
      taskModel.aggregate(query, function (err, summary) {
        let programsMap = summary.reduce((t, p) => {
          t[p._id] = p;
          return t;
        }, {})
        staticPrograms.forEach((d, i) => {
          staticPrograms[i].plannedTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].plannedTotal : 0;
          staticPrograms[i].actualTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].actualTotal : 0;
        })
        return res.json({ success: true, data: staticPrograms });
      });
    }).lean();

  },

  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
     
      var portfolioCycle= new portfolioCycleModel({
        portfolio: req.body.portfolio,
        status: req.body.status,
        startDate: req.body.startDate,
        programs: req.body.programs,
        endDate: req.body.endDate,
        totalEstimatedBudget: req.body.totalEstimatedBudget,
        periodFrom: req.body.periodFrom,
        periodTo: req.body.periodTo,
        manager: req.body.manager,
        createdBy: req.body.createdBy,
        createDate: req.body.createDate,
        updateDate: req.body.updateDate,
        updatedBy: req.body.updatedBy
      });

      portfolioCycle.save(function (err, data) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating portfolioCycle",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolioCycle created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(portfolio);
        return res.json({ success: true, msg: "portfolioCycle is created", data});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioCycleModel.findOne({ _id: ObjectId(id) }, function (err, portfolioCycle) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolioCycle",
            error: err
          });
        }
        if (!portfolioCycle) {
          const LOGMESSAGE = DATETIME + "|No such portfolioCycleto update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolioCycle"
          });
        }
        portfolioCycle.status = req.body.status ? req.body.status : portfolioCycle.status;
        portfolioCycle.portfolioCycle = req.body.portfolioCycle ? req.body.portfolioCycle : portfolioCycle.portfolioCycle;
        portfolioCycle.programs = req.body.programs ? req.body.programs : portfolioCycle.programs;
        portfolioCycle.startDate = req.body.startDate ? req.body.startDate : portfolioCycle.startDate;
        portfolioCycle.endDate = req.body.endDate ? req.body.endDate : portfolioCycle.endDate;
        portfolioCycle.totalEstimatedBudget = req.body.totalEstimatedBudget ? req.body.totalEstimatedBudget : portfolioCycle.totalEstimatedBudget;
        portfolioCycle.periodFrom = req.body.periodFrom ? req.body.periodFrom : portfolioCycle.periodFrom;
        portfolioCycle.periodTo = req.body.periodTo ? req.body.periodTo : portfolioCycle.periodTo;
        portfolioCycle.manager = req.body.manager ? req.body.manager : portfolioCycle.manager;
        portfolioCycle.createdBy = req.body.createdBy ? req.body.createdBy : portfolioCycle.createdBy;
        portfolioCycle.createDate = req.body.createDate ? req.body.createDate : portfolioCycle.createDate;
        portfolioCycle.updateDate = req.body.updateDate ? req.body.updateDate : portfolioCycle.updateDate;
        portfolioCycle.updatedBy = req.body.updatedBy ? req.body.updatedBy : portfolioCycle.updatedBy;

        portfolioCycle.save(function (err, data) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating portfolioCycle.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated portfolioCycle:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "portfolioCycle is updated", data});
          // return res.json(portfolio);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioCycleModel.findByIdAndRemove(id, function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the portfolioCycle.",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|portfolioCyclenot found to delete|" + portfolio;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "portfolioCycleis deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolioCycle.",
        error: error
      });
    }

  }
};
