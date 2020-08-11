const dateFormat = require("dateformat");

const riskStatusModel = require("../models/riskStatusModel.js");
const userModel = require("../models/userModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      riskStatusModel.find(function (err, riskStatus) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Risk Status.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Risk Status List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: riskStatus });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Risk Status.",
        error: error
      });
    }

  },

  // showByUserId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.userId;
  //     userModel.findOne({ _id: id }, 'username').populate("riskStatus").exec(function (err, riskStatus) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting riskStatus.",
  //           error: err
  //         });
  //       }
  //       if (!riskStatus) {
  //         const LOGMESSAGE = DATETIME + "|No such riskStatus:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such riskStatus:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|riskStatus Found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:riskStatus});
  //       // return res.json(riskStatus);
  //     });      
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting riskStatus.",
  //       error: error
  //     });
  //   }

  // },
  // showUsersByriskStatusId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.id;
  //     userModel.find({ riskStatus: id }, function (err, riskStatus) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting riskStatus.",
  //           error: err
  //         });
  //       }
  //       if (!riskStatus) {
  //         const LOGMESSAGE = DATETIME + "|NO Such riskStatus:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such riskStatus:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|riskStatus found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:riskStatus});
  //       // return res.json(riskStatus);
  //     });
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting riskStatus.",
  //       error: error
  //     });
  //   }

  // },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var riskStatus = new riskStatusModel({
        name: req.body.name,
        description: req.body.description
      });

      riskStatus.save(function (err, riskStatus) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Risk Status",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Risk Status created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(riskStatus);
        return res.json({ success: true, msg: "riskStatus is created", data: riskStatus });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Risk Status.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      riskStatusModel.findOne({ _id: id }, function (err, riskStatus) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Risk Status",
            error: err
          });
        }
        if (!riskStatus) {
          const LOGMESSAGE = DATETIME + "|No such Risk Status to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such Risk Status"
          });
        }

        riskStatus.name = req.body.name ? req.body.name : riskStatus.name;
        riskStatus.description = req.body.description ? req.body.description : riskStatus.description;


        riskStatus.save(function (err, riskStatus) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating Risk Status.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated Risk Status:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "riskStatus is updated", data: riskStatus });
          // return res.json(riskStatus);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Risk Status.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      riskStatusModel.findByIdAndRemove(id, function (err, riskStatus) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the riskStatus.",
            error: err
          });
        }
        if (!riskStatus) {
          const LOGMESSAGE = DATETIME + "|Risk Status not found to delete|" + riskStatus;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed riskStatus:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "riskStatus is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Risk Status.",
        error: error
      });
    }

  }
};
