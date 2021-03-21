const dateFormat = require("dateformat");

const departmentModel = require("../models/departmentModel.js");
const userModel = require('../models/userModel');
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      departmentModel.find(function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting department.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Department List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: department });
      }).sort({$natural:-1}).populate('HOD', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department.",
        error: error
      });
    }

  },

  showByUserId: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.userId;
    try {
      userModel.findOne({ _id: id }, 'username').populate('department').exec(function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting department.",
            error: err
          });
        }
        if (!department) {
          const LOGMESSAGE = DATETIME + "|No such department";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such department"
          });
        }
        const LOGMESSAGE = DATETIME + "|Department found with id:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: department });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department.",
        error: error
      });
    }

  },
  showUsersByDeptId: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      userModel.find({ department: id }).exec(function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting department.",
            error: err
          });
        }
        if (!department) {
          const LOGMESSAGE = DATETIME + "|No such departent";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such department"
          });
        }
        const LOGMESSAGE = DATETIME + "|Find users under department:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: department });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var department = new departmentModel({
        name: req.body.name,
        description: req.body.description,
        HOD: req.body.HOD
      });
      department.save(function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg:  err.code == 11000 ? "Department already exists!" : "Error when creating department",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|created department";
        log.write("INFO", LOGMESSAGE);
        return res.status(201).json({ success: true, msg: "department is created", data: department });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      console.dir(error);
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department!",
        error: error
      });
    }

  },

  update: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      departmentModel.findOne({ _id: id }, function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting department",
            error: err
          });
        }
        if (!department) {
          const LOGMESSAGE = DATETIME + "|No such department:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such department"
          });
        }

        department.name = req.body.name ? req.body.name : department.name;
        department.description = req.body.description ? req.body.description : department.description;
        department.HOD = req.body.HOD ? req.body.HOD : department.HOD;


        department.save(function (err, department) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|Error when updating department";
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating department.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated info of department:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ sucess: true, msg: "Department is updated", data: department });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      departmentModel.findByIdAndRemove(id, function (err, department) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the department.",
            error: err
          });
        }
        if (!department) {
          const LOGMESSAGE = DATETIME + "|department not found to delete|" + department;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|Department is deleted: " + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "department is removed" });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting department.",
        error: error
      });
    }

  }
};
