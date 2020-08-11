const dateFormat = require("dateformat");

const benefitsNatureModel = require("../models/benefitsNatureModel.js");
const userModel = require("../models/userModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      benefitsNatureModel.find(function (err, benefitsNature) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Benefits Nature.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Benefits Nature List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: benefitsNature });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Benefits Nature.",
        error: error
      });
    }

  },

  // showByUserId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.userId;
  //     userModel.findOne({ _id: id }, 'username').populate("benefitsNature").exec(function (err, benefitsNature) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting benefitsNature.",
  //           error: err
  //         });
  //       }
  //       if (!benefitsNature) {
  //         const LOGMESSAGE = DATETIME + "|No such benefitsNature:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such benefitsNature:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|Benefits Nature Found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:benefitsNature});
  //       // return res.json(benefitsNature);
  //     });      
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting benefitsNature.",
  //       error: error
  //     });
  //   }

  // },
  // showUsersBybenefitsNatureId: function (req, res) {
  //   try {
  //     const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  //     var id = req.params.id;
  //     userModel.find({ benefitsNature: id }, function (err, benefitsNature) {
  //       if (err) {
  //         const LOGMESSAGE = DATETIME + "|" + err.message;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(500).json({
  //           success:false,
  //           msg: "Error when getting benefitsNature.",
  //           error: err
  //         });
  //       }
  //       if (!benefitsNature) {
  //         const LOGMESSAGE = DATETIME + "|NO Such benefitsNature:"+id;
  //         log.write("ERROR", LOGMESSAGE);
  //         return res.status(404).json({
  //           success:false,
  //           msg: "No such benefitsNature:"+id
  //         });
  //       }
  //       const LOGMESSAGE = DATETIME + "|Benefits Nature found:"+id;
  //       log.write("INFO", LOGMESSAGE);
  //       return res.json({success:true,data:benefitsNature});
  //       // return res.json(benefitsNature);
  //     });
  //   } catch (error) {
  //     const LOGMESSAGE = DATETIME + "|" + error.message;
  //     log.write("ERROR", LOGMESSAGE);
  //     return res.status(500).json({
  //       success:false,
  //       msg: "Error when getting benefitsNature.",
  //       error: error
  //     });
  //   }

  // },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var benefitsNature = new benefitsNatureModel({
        name: req.body.name,
        description: req.body.description
      });

      benefitsNature.save(function (err, benefitsNature) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Benefits Nature",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Benefits Nature created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(benefitsNature);
        return res.json({ success: true, msg: "Benefits Nature is created", data: benefitsNature });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Benefits Nature.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      benefitsNatureModel.findOne({ _id: id }, function (err, benefitsNature) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Benefits Nature",
            error: err
          });
        }
        if (!benefitsNature) {
          const LOGMESSAGE = DATETIME + "|No such Benefits Nature to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such Benefits Nature"
          });
        }

        benefitsNature.name = req.body.name ? req.body.name : benefitsNature.name;
        benefitsNature.description = req.body.description ? req.body.description : benefitsNature.description;


        benefitsNature.save(function (err, benefitsNature) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating Benefits Nature.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated Benefits Nature:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "Benefits Nature is updated", data: benefitsNature });
          // return res.json(benefitsNature);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Benefits Nature.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      benefitsNatureModel.findByIdAndRemove(id, function (err, benefitsNature) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the Benefits Nature.",
            error: err
          });
        }
        if (!benefitsNature) {
          const LOGMESSAGE = DATETIME + "|Benefits Nature not found to delete|" + benefitsNature;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed Benefits Nature:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "Benefits Nature is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting Benefits Nature.",
        error: error
      });
    }

  }
};
