const dateFormat = require("dateformat");

const portfolioModel = require("../models/portfolioModel");

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


  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var portfolio = new portfolioModel({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        budgetRequiredTotal: req.body.budgetRequiredTotal,
        periodFrom: req.body.periodFrom,
        periodTo: req.body.periodTo,
        manager: req.body.manager,
        createdBy: req.body.createdBy,
        createDate: req.body.createDate,
        updateDate: req.body.updateDate,
        updatedBy: req.body.updatedBy
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
        portfolio.status = req.body.status ? req.body.status : portfolio.status;
        portfolio.startDate = req.body.startDate ? req.body.startDate : portfolio.startDate;
        portfolio.endDate = req.body.endDate ? req.body.endDate : portfolio.endDate;
        portfolio.budgetRequiredTotal = req.body.budgetRequiredTotal ? req.body.budgetRequiredTotal : portfolio.budgetRequiredTotal;
        portfolio.periodFrom = req.body.periodFrom ? req.body.periodFrom : portfolio.periodFrom;
        portfolio.periodTo = req.body.periodTo ? req.body.periodTo : portfolio.periodTo;
        portfolio.manager = req.body.manager ? req.body.manager : portfolio.manager;
        portfolio.createdBy = req.body.createdBy ? req.body.createdBy : portfolio.createdBy;
        portfolio.createDate = req.body.createDate ? req.body.createDate : portfolio.createDate;
        portfolio.updateDate = req.body.updateDate ? req.body.updateDate : portfolio.updateDate;
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
