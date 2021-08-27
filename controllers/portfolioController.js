const dateFormat = require("dateformat");

const portfolioModel = require("../models/portfolioModel");
var ObjectId = require('mongoose').Types.ObjectId;
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      portfolioModel.find(function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolio.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolio List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolio });
      }).populate('manager', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  },

  showByPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioModel.findOne({ _id: id }).populate('manager', 'username').exec(function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolio.",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|No such portfolio";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolio"
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolio Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolio });
        // return res.json(portfolio);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  },
  showByUserId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioModel.find({ manager: ObjectId(id) },function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolio.",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|No such portfolio";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolio"
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolio Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: portfolio });
      }).populate('manager', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  },


  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var portfolio = new portfolioModel({
        _id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        manager: req.body.createdBy,
        createdBy: req.body.createdBy,
        createDate: req.body.createDate,
        totalEstimatedBudget: req.body.totalEstimatedBudget
      });

      portfolio.save(function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating portfolio",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|portfolio created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(portfolio);
        return res.json({ success: true, msg: "portfolio is created", data: portfolio });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioModel.findOne({ _id: id }, function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting portfolio",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|No such portfolio to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such portfolio"
          });
        }

        portfolio.name = req.body.name ? req.body.name : portfolio.name;
        portfolio.description = req.body.description ? req.body.description : portfolio.description;
        portfolio.totalEstimatedBudget = req.body.totalEstimatedBudget ? req.body.totalEstimatedBudget : portfolio.totalEstimatedBudget;
        portfolio.updatedBy = req.body.updatedBy ? req.body.updatedBy : portfolio.updatedBy;

        portfolio.save(function (err, portfolio) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating portfolio.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated portfolio:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "portfolio is updated", data: portfolio });
          // return res.json(portfolio);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      portfolioModel.findByIdAndRemove(id, function (err, portfolio) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the portfolio.",
            error: err
          });
        }
        if (!portfolio) {
          const LOGMESSAGE = DATETIME + "|portfolio not found to delete|" + portfolio;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed portfolio:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "portfolio is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting portfolio.",
        error: error
      });
    }

  }
};
