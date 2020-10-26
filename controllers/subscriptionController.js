const dateFormat = require("dateformat");

const subscriptionModel = require("../models/subscriptionModel.js");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      subscriptionModel.find(function (err, subscription) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting subscription.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|subscription List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: subscription });
      }).populate('HOD', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting subscription.",
        error: error
      });
    }

  },

  byCompanyId: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      subscriptionModel.find({ company: id }).exec(function (err, subscription) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting subscription.",
            error: err
          });
        }
        if (!subscription) {
          const LOGMESSAGE = DATETIME + "|No such company subscription";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such subscription"
          });
        }
        const LOGMESSAGE = DATETIME + "|Find company subscription:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: subscription });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting company subscription.",
        error: error
      });
    }

  },
  byId: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      subscriptionModel.find({ _id: id }).exec(function (err, subscription) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting subscription.",
            error: err
          });
        }
        if (!subscription) {
          const LOGMESSAGE = DATETIME + "|No such subscription";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such subscription"
          });
        }
        const LOGMESSAGE = DATETIME + "|Find subscription:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: subscription });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting subscription.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var subscription = new subscriptionModel({
        company: req.body.company,
        validity: req.body.validity,
        type: req.body.type,
        createdBy: req.body.createdBy
      });
      subscription.save(function (err, subscription) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating subscription",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|created subscription";
        log.write("INFO", LOGMESSAGE);
        return res.status(201).json({ success: true, msg: "subscription is created", data: subscription });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting subscription.",
        error: error
      });
    }

  },

  update: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      subscriptionModel.findOne({ _id: id }, function (err, subscription) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting subscription",
            error: err
          });
        }
        if (!subscription) {
          const LOGMESSAGE = DATETIME + "|No such subscription:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such subscription"
          });
        }
        
        subscription.company = req.body.company ? req.body.company : subscription.company;
        subscription.validity = req.body.validity ? req.body.validity : subscription.validity;
        subscription.type = req.body.type ? req.body.type : subscription.type;
        subscription.save(function (err, subscription) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|Error when updating subscription";
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating subscription.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated info of subscription:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ sucess: true, msg: "subscription is updated", data: subscription });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting subscription.",
        error: error
      });
    }

  }


};
