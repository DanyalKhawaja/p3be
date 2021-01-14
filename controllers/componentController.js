const dateFormat = require("dateformat");

const componentModel = require("../models/componentModel");

const log = require('../lib/logger');
const projectModel = require("../models/projectModel");

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      componentModel.find({ program: null }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|component List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: component });
      })
        .populate('manager', 'username')
        .populate('sponsor', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }
  },
  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.findOne({ _id: id })
        .populate('program', 'name')
        .populate('manager', 'username')
        .populate('sponsor', 'username').exec(function (err, component) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting component.",
              error: err
            });
          }
          if (!component) {
            const LOGMESSAGE = DATETIME + "|No such component:" + id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such component:" + id
            });
          }
          const LOGMESSAGE = DATETIME + "|component Found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: component });
          // return res.json(component);
        });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  showByProgramId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.find({ program: id }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component.",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|NO Such component of program:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such component"
          });
        }
        const LOGMESSAGE = DATETIME + "|component found of program:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: component });
        // return res.json(component);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  lockedList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.find({ locked: true }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component.",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|NO Such component of program:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such component"
          });
        }
        const LOGMESSAGE = DATETIME + "|component found of program:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: component });
        // return res.json(component);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  openList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.find({ locked: false }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component.",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|NO Such component of program:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such component"
          });
        }
        const LOGMESSAGE = DATETIME + "|component found of program:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: component });
        // return res.json(component);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      let { component, projects } = req.body;
      componentModel.insertMany(component, function (err, components) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating component",
            error: err
          });
        }

        projects.forEach((d, i) => {
          projects[i].component = components[0]._id;
          projects[i].createdBy = components[0].createdBy;
        })
        projectModel.insertMany(projects, function (err, projects) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating projects",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|projects created";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "component & projects created", data: projects });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.findOne({ _id: id }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|No such component to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such component"
          });
        }


        component.program = req.body.program ? req.body.program : component.program,
          component.name = req.body.name ? req.body.name : component.name,
          component.startDate = req.body.startDate ? req.body.startDate : component.startDate,
          component.endDate = req.body.endDate ? req.body.endDate : component.endDate,
          component.createdBy = req.body.createdBy ? req.body.createdBy : component.createdBy



        component.save(function (err, component) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating component.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated component:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "component is updated", data: component });
          // return res.json(component);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },
  lock: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.findOne({ _id: id }, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting component",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|No such component to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such component"
          });
        }

        component.locked = true;
        component.lockedOn = DATETIME,



          component.save(function (err, component) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating component.",
                error: err
              });
            }
            const LOGMESSAGE = DATETIME + "|Updated component:" + id;
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, msg: "component is updated", data: component });
            // return res.json(component);
          });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      componentModel.findByIdAndRemove(id, function (err, component) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the component.",
            error: err
          });
        }
        if (!component) {
          const LOGMESSAGE = DATETIME + "|component not found to delete|" + component;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed component:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "component is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting component.",
        error: error
      });
    }

  }
};
