const dateFormat = require("dateformat");

const programModel = require("../models/programModel");
const projectModel = require("../models/projectModel");
const taskModel = require("../models/taskModel");
var ObjectId = require('mongoose').Types.ObjectId;
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programModel.find({}, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|program List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: program });
      })
        .populate('manager', 'username')
        .populate('sponsor', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }
  },
  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id })
        .populate('portfolio', 'name')
        .populate('manager', 'username')
        .populate('sponsor', 'username').exec(function (err, program) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting program.",
              error: err
            });
          }
          if (!program) {
            const LOGMESSAGE = DATETIME + "|No such program:" + id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such program:" + id
            });
          }
          const LOGMESSAGE = DATETIME + "|program Found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: program });
          // return res.json(program);
        });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  showByPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ portfolio: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program.",
            error: err
          });
        }

        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: program });
        // return res.json(program);
      }).populate('manager', "username").populate('sponsor', "username").lean();
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  notLinked: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programModel.find({ portfolio: null }, function (err, staticPrograms) {
        if (err) {

          return res.status(500).json({
            success: false,
            msg: "Error when getting programs.",
            error: err
          });
        }
        if (!staticPrograms) {


          return res.status(404).json({
            success: false,
            msg: "No such programs"
          });
        }

        return res.json({ success: true, data: staticPrograms });

        // let programs = staticPrograms.map(d => ObjectId(d._id));

        // let query = [{ $match: { taskId: "0" } }, { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'Project' } }, { $unwind: { path: "$Project" } }, { $lookup: { from: 'programs', localField: 'Project.program', foreignField: '_id', as: 'Program' } }, { $unwind: { path: "$Program" } }, { $match: { 'Program._id': { $in: programs } } },
        // { $group: { _id: "$Program._id", plannedTotal: { $sum: "$plannedCost" }, actualTotal: { $sum: "$actualCost" } } }]
        // taskModel.aggregate(query, function (err, summary) {
        //   let programsMap = summary.reduce((t, p) => {
        //     t[p._id] = p;
        //     return t;
        //   }, {})
        //   staticPrograms.forEach((d, i) => {
        //     staticPrograms[i].plannedTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].plannedTotal : 0;
        //     staticPrograms[i].actualTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].actualTotal : 0;
        //   })
        //   return res.json({ success: true, data: staticPrograms });
        // });
      }).lean();
    } catch (error) {


      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  available: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.portfolioId;
      programModel.find({ portfolio: { $in: [ObjectId(id), null] } }, function (err, staticPrograms) {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: "Error when getting programs.",
            error: err
          });
        }
        console.log(staticPrograms)
        if (!staticPrograms) {
          return res.status(404).json({
            success: false,
            msg: "No such programs"
          });
        }
        return res.json({ success: true, data: staticPrograms });


        // let programs = staticPrograms.map(d => ObjectId(d._id));

        // let query = [{ $match: { taskId: "0" } }, { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'Project' } }, { $unwind: { path: "$Project" } }, { $lookup: { from: 'programs', localField: 'Project.program', foreignField: '_id', as: 'Program' } }, { $unwind: { path: "$Program" } }, { $match: { 'Program._id': { $in: programs } } },
        // { $group: { _id: "$Program._id", plannedTotal: { $sum: "$plannedCost" }, actualTotal: { $sum: "$actualCost" } } }]
        // taskModel.aggregate(query, function (err, summary) {
        //   let programsMap = summary.reduce((t, p) => {
        //     t[p._id] = p;
        //     return t;
        //   }, {})
        //   staticPrograms.forEach((d, i) => {
        //     staticPrograms[i].plannedTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].plannedTotal : 0;
        //     staticPrograms[i].actualTotal = programsMap[d._id.toString()] ? programsMap[d._id.toString()].actualTotal : 0;
        //   })
        //   return res.json({ success: true, data: staticPrograms });
        // });
      }).lean();
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  showByUserId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ manager: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program.",
            error: err
          });
        }

        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: program });
        // return res.json(program);
      }).populate('manager', 'username').populate('sponsor', 'username').lean();
    } catch (error) {
      console.log(error)
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  lockedList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ locked: true }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: program });
        // return res.json(program);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  openList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ locked: false }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: program });
        // return res.json(program);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var program = new programModel({
        // portfolio: req.body.portfolio,
        name: req.body.name,
        startDate: req.body.startDate,
        // currency: req.body.currency,
        endDate: req.body.endDate,
        // periodFrom: req.body.periodFrom,
        // periodTo: req.body.periodTo,
        // status: req.body.status,
        manager: req.body.manager,
        sponsor: req.body.sponsor,
        createdBy: req.body.createdBy,
        createdDate: req.body.createdDate,
        budgetRequired: req.body.budgetRequired,
        totalEstimatedBudget: req.body.totalEstimatedBudget
      });

      program.save(function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating program",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|program created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(program);

        projectModel.updateMany({ _id: { $in: req.body.projects } }, { $set: { program: program._id } }, function (err, data) {
          return res.json({ success: true, msg: "program is created", data: program });
        })

      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  linkedProjects: function (req, res) {
    projectModel.find({ program: ObjectId(req.params.programId) }, function (err, projects) {
      return res.json({ success: true, data: projects });
    }).lean();

  },
  checkedProjects: function (req, res) {
    // let query = [{ $match: { taskId: "0", "plannedStartDate": { $gte: new Date(req.params.startDate) }, "plannedEndDate": { $lte: new Date(req.params.endDate) } } }, { $lookup: { from: 'projects', localField: 'project', foreignField: '_id', as: 'Project' } }, { $unwind: { path: "$Project" } }, { $match: { 'Project.program': { $in: [null, Object(req.params.programId)] } } },
    // { $group: { _id: { _id: "$Project._id", name: "$Project.name", startDate: "$Project.expectedStartDate", endDate: "$Project.expectedEndDate" }, plannedTotal: { $sum: "$plannedCost" }, actualTotal: { $sum: "$actualCost" } } }];
    // taskModel.aggregate(query, function (err, summary) {
    projectModel.find({ expectedStartDate: { $gte: new Date(req.params.startDate) }, expectedEndDate: { $lte: new Date(req.params.endDate) }, program: [null, ObjectId(req.params.programId)] }, function (err, projects) {
      projects.forEach((d, i) => {
        if (d.program) projects[i].checked = true;
      });

      return res.json({ success: true, data: projects });

    }).populate('component','name').lean();

  },
  staticProjects: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    projectModel.find({ expectedStartDate: { $gte: new Date(req.params.startDate) }, expectedEndDate: { $lte: new Date(req.params.endDate) }, program: [null, ObjectId(req.params.programId)] }, function (err, projects) {
      console.log(projects)
      return res.json({ success: true, data: projects });
    }).populate('component','name').lean();

   
  },
  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|No such program to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }


        program.program = req.body.program ? req.body.program : program.program;
        program.name = req.body.name ? req.body.name : program.name;
        program.startDate = req.body.startDate ? req.body.startDate : program.startDate;
        program.endDate = req.body.endDate ? req.body.endDate : program.endDate;
        program.status = req.body.status ? req.body.status : program.status;
        program.manager = req.body.manager ? req.body.manager : program.manager;
        program.sponsor = req.body.sponsor ? req.body.sponsor : program.sponsor;
        program.totalEstimatedBudget = req.body.totalEstimatedBudget ? req.body.totalEstimatedBudget : program.totalEstimatedBudget;

        program.createdBy = req.body.createdBy ? req.body.createdBy : program.createdBy;



        program.save(function (err, program) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating program.",
              error: err
            });
          }


          projectModel.updateMany({ program: ObjectId(req.params.id) }, { $set: { program: null } }, function (err, data2) {
            projectModel.updateMany({ _id: { $in: req.body.projects } }, { $set: { program: ObjectId(req.params.id) } }, function (err, data3) {
              const LOGMESSAGE = DATETIME + "|Updated program:" + id;
              log.write("INFO", LOGMESSAGE);
              return res.json({ success: true, msg: "program is updated", data: program });
            })

          })




          // return res.json(program);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  link: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    programModel.updateMany({ portfolio: ObjectId(id) }, { portfolio: null }, function (err, data) {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Error when getting program",
          error: err
        });
      }
      if (req.body.length == 0) return res.json({ success: true, msg: "programs updated", data });
      programModel.updateMany({ _id: { $in: req.body.map(d => ObjectId(d)) } }, { portfolio: ObjectId(id) }, function (err, data) {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: "Error when getting program",
            error: err
          });
        }
        return res.json({ success: true, msg: "programs updated", data });
      });

    });

  },
  lock: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting program",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|No such program to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such program"
          });
        }

        program.locked = true;
        program.lockedOn = DATETIME,



          program.save(function (err, program) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating program.",
                error: err
              });
            }
            const LOGMESSAGE = DATETIME + "|Updated program:" + id;
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, msg: "program is updated", data: program });
            // return res.json(program);
          });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findByIdAndRemove(id, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|program not found to delete|" + program;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed program:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "program is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting program.",
        error: error
      });
    }

  }
};
