const dateFormat = require("dateformat");

const boqModel = require("../models/boqModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      boqModel.find(function (err, boq) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting boq.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: boq });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting boq.",
        error: error
      });
    }

  },
  adminList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      boqModel.find({ type: "4" }, function (err, boq) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting boq.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: boq });
      }).sort({$natural:-1});
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting boq.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var boq = new boqModel({
        name: req.body.name
      });

      boq.save(function (err, boq) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating issue Type",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue Type created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(issue Type);
        return res.json({ success: true, msg: "issue Type is created", data: boq });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success: false,
        msg: "Error when creating issue Type",
        error: error
      });
    }
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      boqModel.findByIdAndRemove(id, function (err, boq) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the issue Type.",
            error: err
          });
        }
        if (!boq) {
          const LOGMESSAGE = DATETIME + "|boq not found to delete|" + boq;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "issue Type is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success: false,
        msg: "Error when updating issue Type",
        error: error
      });
    }
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    boqModel.findOne({ _id: id }, function (err, boq) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success: false,
          msg: "Error when getting issue Type",
          error: err
        });
      }
      if (!boq) {
        const LOGMESSAGE = DATETIME + "|No such issue Type to update";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success: false,
          msg: "No such issue Type"
        });
      }


      boq.name = req.body.name ? req.body.name : boq.name;


      boq.save(function (err, projeectType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when updating issue Type.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Saved issue Type";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "issue Type is updated", data: boq });
        // return res.json(issue Type);
      });
    });
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      boqModel.findByIdAndRemove(id, function (err, boq) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the issue Type.",
            error: err
          });
        }
        if (!boq) {
          const LOGMESSAGE = DATETIME + "|boq not found to delete|" + boq;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue Type:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "issue Type is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.json({
        success: false,
        msg: "Error when removing issue Type",
        error: error
      });
    }

  }
};
