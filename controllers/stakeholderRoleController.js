const dateFormat = require("dateformat");

const stakeholderRoleModel = require("../models/stakeholderRoleModel.js");
const userModel = require("../models/userModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      stakeholderRoleModel.find(function (err, stakeholderRole) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Stakeholder Role.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Stakeholder Role List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: stakeholderRole });
      }).sort({$natural:-1});
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Stakeholder Role.",
        error: error
      });
    }

  },

  // showByUserId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.userId;
  //     userModel.findOne({ _id: id }, 'username').populate("stakeholderRole").exec(function (err, stakeholderRole) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting stakeholderRole.",
  //           error: err
  //         });
  //       }
  //       if (!stakeholderRole) {
  //         const LOGMESSAGE = DATETIME + "|No such stakeholderRole:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such stakeholderRole:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|stakeholderRole Found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:stakeholderRole});
  //       // return res.json(stakeholderRole);
  //     });      
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting stakeholderRole.",
  //       error: error
  //     });
  //   }

  // },
  // showUsersBystakeholderRoleId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.id;
  //     userModel.find({ stakeholderRole: id }, function (err, stakeholderRole) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting stakeholderRole.",
  //           error: err
  //         });
  //       }
  //       if (!stakeholderRole) {
  //         const LOGMESSAGE = DATETIME + "|NO Such stakeholderRole:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such stakeholderRole:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|stakeholderRole found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:stakeholderRole});
  //       // return res.json(stakeholderRole);
  //     });
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting stakeholderRole.",
  //       error: error
  //     });
  //   }

  // },

  create: function (req, res) {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var stakeholderRole = new stakeholderRoleModel({
        name: req.body.name
      });

      stakeholderRole.save(function (err, data) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Stakeholder Role",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Stakeholder Role created";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "Stakeholder Role is created", data });
      });
   

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      stakeholderRoleModel.findOne({ _id: id }, function (err, stakeholderRole) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Stakeholder Role",
            error: err
          });
        }
        if (!stakeholderRole) {
          const LOGMESSAGE = DATETIME + "|No such Stakeholder Role to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such Stakeholder Role"
          });
        }

        stakeholderRole.name =  req.body.name ;

        stakeholderRole.save(function (err, stakeholderRole) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating Stakeholder Role.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated Stakeholder Role:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "Stakeholder Role is updated", data: stakeholderRole });
          // return res.json(stakeholderRole);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Stakeholder Role.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      stakeholderRoleModel.findByIdAndRemove(id, function (err, stakeholderRole) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the Stakeholder Role.",
            error: err
          });
        }
        if (!stakeholderRole) {
          const LOGMESSAGE = DATETIME + "|Stakeholder Role not found to delete|" + stakeholderRole;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed Stakeholder Role:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "Stakeholder Role is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Stakeholder Role.",
        error: error
      });
    }

  }
};
