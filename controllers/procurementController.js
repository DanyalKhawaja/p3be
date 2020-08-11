const dateFormat = require("dateformat");

const procurementModel = require("../models/procurementModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      procurementModel.find(function (err, procurement) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting procurement.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|procurement List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: procurement });
      }).populate('project','name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting procurement.",
        error: error
      });
    }

  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;

      procurementModel.find({ project: id }).populate('project','name').exec(function (err, procurement) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting procurement.",
            error: err
          });
        }
        if (!procurement) {
          const LOGMESSAGE = DATETIME + "|No such procurement:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such procurement:" + id
          });
        }
        const LOGMESSAGE = DATETIME + "|procurement Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: procurement });
        // return res.json(procurement);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting procurement.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var procurement = new procurementModel({
        project: req.body.project,
        seller: req.body.seller,
        sow: req.body.sow,
        price: req.body.price,
        completion: req.body.completion,
        deliverable: req.body.deliverable,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        targetDate: req.body.targetDate,
        status: req.body.status
      });

      procurement.save(function (err, procurement) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|procurement created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(procurement);
        return res.json({ success: true, msg: "procurement is created", data: procurement });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting procurement.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      procurementModel.findOne({ _id: id }, function (err, procurement) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting procurement",
            error: err
          });
        }
        if (!procurement) {
          const LOGMESSAGE = DATETIME + "|No such procurement to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such procurement"
          });
        }

        procurement.project = req.body['project'] ? req.body['project'] : procurement.project;
        procurement.seller = req.body['seller'] ? req.body['seller'] : procurement.seller;
        procurement.sow = req.body['sow'] ? req.body['sow'] : procurement.sow;
        procurement.price = req.body['price'] ? req.body['price'] : procurement.price;
        procurement.completion = req.body['completion'] ? req.body['completion'] : procurement.completion;
        procurement.deliverable = req.body['deliverable'] ? req.body['deliverable'] : procurement.deliverable;
        procurement.contactName = req.body['contactName'] ? req.body['contactName'] : procurement.contactName;
        procurement.contactPhone = req.body['contactPhone'] ? req.body['contactPhone'] : procurement.contactPhone;
        procurement.targetDate = req.body['targetDate'] ? req.body['targetDate'] : procurement.targetDate;
        procurement.status = req.body['status'] ? req.body['status'] : procurement.status;
        procurement.save(function (err, procurement) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating procurement.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated procurement:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "procurement is updated", data: procurement });
          // return res.json(procurement);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting procurement.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      procurementModel.deleteOne({ _id: id }, function (err, procurement) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the procurement.",
            error: err
          });
        }
        if (!procurement) {
          const LOGMESSAGE = DATETIME + "|procurement not found to delete|" + procurement;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (procurement.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed procurement:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "procurement is deleted", procurement });
        } else {
          const LOGMESSAGE = DATETIME + "|removed procurement:" + id;
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
        msg: "Error when getting procurement.",
        error: error
      });
    }

  },

};
