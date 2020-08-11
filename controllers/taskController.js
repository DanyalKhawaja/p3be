const dateFormat = require("dateformat");
var mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const taskModel = require("../models/taskModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskModel.find(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|task List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var projectId = req.params.projectId;
      taskModel.find({ taskId: id, project: projectId }).exec(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|No such task:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|task Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
        // return res.json(task);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showTaskByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      taskModel.find({ project: id }, function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|NO Such task of project:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        }
        const LOGMESSAGE = DATETIME + "|task found of project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
        // return res.json(task);
      }).sort({ taskId: 1 }).populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showWPTasksByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      taskModel.find({ project: id, workPackage: true }, function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|NO Such task of project:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        }
        const LOGMESSAGE = DATETIME + "|task found of project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: task });
        // return res.json(task);
      }).sort({ taskId: 1 }).populate('ProjectLocation', 'projectLocationName');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },



  showStartDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskModel.find({ project: id }, "plannedStartDate").exec(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|No such task";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        }
        const LOGMESSAGE = DATETIME + "| task found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showEndDate: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      taskModel.find({ project: id }, "plannedEndDate").exec(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|No such task";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        }
        const LOGMESSAGE = DATETIME + "| task found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showTotalPlannedCostByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      console.log(id)
      taskModel.aggregate([
        {
          $match: {
            project: ObjectId(id),
            workPackage: true
          }
        },
        {
          $group: {
            _id: null,
            plannedCost: { $sum: '$plannedCost' }
          }
        }
      ],
        // [{ project: id, workPackage: true ,"totalPlannedCost":{$sum:'$plannedCost'}}]).exec(
        function (err, task) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting task.",
              error: err
            });
          }
          if (!task) {
            const LOGMESSAGE = DATETIME + "|No such task";
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such task"
            });
          }
          console.log(task)
          const LOGMESSAGE = DATETIME + "| task found";
          log.write("INFO", LOGMESSAGE);
          return res.status(200).json({ success: true, data: task });
        });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showMilestonesByProjetId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      taskModel.find({ project: id, milestone: true }).exec(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Project.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|No such task";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        } else if (task.length == 0) {
          const LOGMESSAGE = DATETIME + "|No such milestone found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No milestone found"
          });
        }
        const LOGMESSAGE = DATETIME + "| task found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  showWorkPackagesByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      taskModel.find({ project: id, workPackage: true }).exec(function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Project.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|No such task";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such task"
          });
        } else if (task.length == 0) {
          const LOGMESSAGE = DATETIME + "|No such workpackage found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No workpackage found"
          });
        }
        const LOGMESSAGE = DATETIME + "| task found";
        log.write("INFO", LOGMESSAGE);
        return res.status(200).json({ success: true, data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      // var task = new taskModel({


      // project: req.body.project,
      // parentTask: req.body.parentTask,
      // description: req.body.description,
      // plannedStartDate: req.body.plannedStartDate,
      // plannedEndDate:req.body.plannedEndDate,
      // workPackage:req.body.workPackage,
      // plannedCost:req.body.plannedCost,
      // deleted: req.body.deleted,
      // milestone: req.body.milestone,
      // createdBy: req.body.createdBy

      // });
      var task = new taskModel(req.body);
      taskModel.create(req.body, function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating task",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|task created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(task);
        return res.json({ success: true, msg: "task is created", data: task });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },
  wbs: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      taskModel.deleteMany({ project: req.body[0].project }, function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the task.",
            error: err
          });
        }
        console.log(err, task);
        if (!task) {
          const LOGMESSAGE = DATETIME + "|task not found to delete|" + task;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }


        taskModel.insertMany(req.body, function (err, data) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating task",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|task created";
          log.write("INFO", LOGMESSAGE);
          // return res.status(201).json(task);

        });


        return res.json({ success: true, msg: req.body.length + " task(s) created", data: "success" });


      });






    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      var arrBody = req.body;
      arrBody.forEach((element, index) => {
        // console.log(element)
        taskModel.findOne({ _id: element._id }, function (err, task) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting task",
              error: err
            });
          }
          if (!task) {
            const LOGMESSAGE = DATETIME + "|No such task to update:" + element._id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "No such task with id" + element._id
            });
          }
          // console.log(req.body)
          console.log(element.project)

          task.project = element.project ? element.project : task.project;
          task.parentTask = element.parentTask ? element.parentTask : task.parentTask;
          task.description = element.description ? element.description : task.description;
          task.plannedStartDate = element.plannedStartDate ? element.plannedStartDate : task.plannedStartDate;
          task.plannedEndDate = element.plannedEndDate ? element.plannedEndDate : task.plannedEndDate;
          task.workPackage = element.workPackage;
          task.plannedCost = element.plannedCost ? element.plannedCost : task.plannedCost;
          task.milestone = element.milestone;
          task.updatedDate = DATETIME;
          task.updatedBy = element.updatedBy ? element.updatedBy : task.updatedBy;
          // console.log(task)
          task.save(function (err, task) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when updating task.",
                error: err
              });
            }
            if (index == arrBody.length - 1) {
              const LOGMESSAGE = DATETIME + "|Updated task:" + id;
              log.write("INFO", LOGMESSAGE);
              return res.json({ success: true, msg: "task list is updated" });
            }
            // return res.json(task);
          });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }


  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.taskId;
      var projectId = req.params.projectId;
      console.log({ taskId: id, project: projectId });

      taskModel.deleteOne({ taskId: id, project: projectId }, function (err, task) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the task.",
            error: err
          });
        }
        if (!task) {
          const LOGMESSAGE = DATETIME + "|task not found to delete|" + task;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed task:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "task is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting task.",
        error: error
      });
    }

  },

};
