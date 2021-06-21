const dateFormat = require("dateformat");

const roleModel = require("../models/roleModel.js");
const userModel = require("../models/userModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      roleModel.find(function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting role.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Role List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:role});
      }).sort({$natural:-1});      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  },

  showByUserId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.userId;
      userModel.findOne({ _id: id }, 'username').populate("role").exec(function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting role.",
            error: err
          });
        }
        if (!role) {
          const LOGMESSAGE = DATETIME + "|No such role:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such role:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|Role Found:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:role});
        // return res.json(role);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  },
  showUsersByRoleId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      userModel.find({ role: id }, function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting role.",
            error: err
          });
        }
        if (!role) {
          const LOGMESSAGE = DATETIME + "|NO Such Role:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such role:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|role found:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:role});
        // return res.json(role);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var role = new roleModel({
        _id: req.body._id,
        name: req.body.name,
        description: req.body.description
      });
  
      role.save(function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating role",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Role created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(role);
        return res.json({success:true,msg:"role is created",data:role});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      roleModel.findOne({ _id: id }, function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting role",
            error: err
          });
        }
        if (!role) {
          const LOGMESSAGE = DATETIME + "|No such role to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such role"
          });
        }
        role._id = req.body._id ? req.body._id : role._id;
        role.name = req.body.name ? req.body.name : role.name;
        role.description = req.body.description ? req.body.description : role.description;
  
  
        role.save(function (err, role) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating role.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated Role:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"role is updated",data:role});
          // return res.json(role);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      roleModel.findByIdAndRemove(id, function (err, role) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the role.",
            error: err
          });
        }
        if (!role) {
          const LOGMESSAGE = DATETIME + "|role not found to delete|" +role;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed role:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"role is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting role.",
        error: error
      });
    }

  }
};
