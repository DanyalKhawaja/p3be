const dateFormat = require("dateformat");

const lessonLearnedModel = require("../models/lessonLearnedModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      lessonLearnedModel.find(function (err, lessonLearned) {
        if (err) {

        }
        const LOGMESSAGE = DATETIME + "|lessonLearned List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: lessonLearned });
      }).populate('lessonLearnedType', 'description').populate('project', 'name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting lessonLearned.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      lessonLearnedModel.find({ project: id }).populate('lessonLearnedType', 'description').populate('project', 'name').exec(function (err, lessonLearned) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting lessonLearned.",
            error: err
          });
        }
        if (!lessonLearned) {
          const LOGMESSAGE = DATETIME + "|No such lessonLearned:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such lessonLearned:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|lessonLearned Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: lessonLearned });
        // return res.json(lessonLearned);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting lessonLearned.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var lessonLearned = new lessonLearnedModel({

        project: req.body.project,
        name: req.body.name,
        lessonLearnedType: req.body.lessonLearnedType,
        priority: req.body.priority,
        description: req.body.description,
        recommendation: req.body.recommendation,
        createdDate: req.body.createdDate,
        createdBy: req.body.createdBy,
        author: req.body.author
      });

      lessonLearned.save(function (err, lessonLearned) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|lessonLearned created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(lessonLearned);
        return res.json({ success: true, msg: "lessonLearned is created", data: lessonLearned });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when creating Resource Change Request",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      lessonLearnedModel.findOne({ _id: id }, function (err, lessonLearned) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting lessonLearned",
            error: err
          });
        }
        if (!lessonLearned) {
          const LOGMESSAGE = DATETIME + "|No such lessonLearned to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such lessonLearned"
          });
        }

        lessonLearned.project = req.body['project'] ? req.body['project'] : lessonLearned.project,
          lessonLearned.name = req.body['name'] ? req.body['name'] : lessonLearned.name,
          lessonLearned.lessonLearnedType = req.body['lessonLearnedType'] ? req.body['lessonLearnedType'] : lessonLearned.lessonLearnedType,
          lessonLearned.priority = req.body['priority'] ? req.body['priority'] : lessonLearned.priority,
          lessonLearned.description = req.body['description'] ? req.body['description'] : lessonLearned.description,
          lessonLearned.recommendation = req.body['recommendation'] ? req.body['recommendation'] : lessonLearned.recommendation,
          lessonLearned.author = req.body['author'] ? req.body['author'] : lessonLearned.author


        lessonLearned.save(function (err, lessonLearned) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating lessonLearned.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated lessonLearned:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "lessonLearned is updated", data: lessonLearned });
          // return res.json(lessonLearned);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting lessonLearned",
        error: error
      });

    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      lessonLearnedModel.deleteOne({ _id: id }, function (err, lessonLearned) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the lessonLearned.",
            error: err
          });
        }
        if (!lessonLearned) {
          const LOGMESSAGE = DATETIME + "|lessonLearned not found to delete|" + lessonLearned;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (lessonLearned.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed lessonLearned:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "lessonLearned is deleted", lessonLearned });
        } else {
          const LOGMESSAGE = DATETIME + "|removed lessonLearned:" + id;
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
        msg: "Error when getting lessonLearned",
        error: error
      });

    }

  },

};
