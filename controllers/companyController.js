const dateFormat = require("dateformat");

const companyModel = require("../models/companyModel.js");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      companyModel.find(function (err, company) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting company.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|company List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: company });
      }).populate('HOD', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting company.",
        error: error
      });
    }

  },

  byId: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      companyModel.find({ _id: id }).exec(function (err, company) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting company.",
            error: err
          });
        }
        if (!company) {
          const LOGMESSAGE = DATETIME + "|No such company";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such company"
          });
        }
        const LOGMESSAGE = DATETIME + "|Find company:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: company });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting company.",
        error: error
      });
    }

  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var company = new companyModel({
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        phoneNo: req.body.phoneNo,
        createdBy: req.body.createdBy
      });
      company.save(function (err, company) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating company",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|created company";
        log.write("INFO", LOGMESSAGE);
        return res.status(201).json({ success: true, msg: "company is created", data: company });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting company.",
        error: error
      });
    }

  },

  update: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      companyModel.findOne({ _id: id }, function (err, company) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting company",
            error: err
          });
        }
        if (!company) {
          const LOGMESSAGE = DATETIME + "|No such company:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such company"
          });
        }

        company.name = req.body.name ? req.body.name : company.name;
        company.email = req.body.email ? req.body.email : company.email;
        company.address = req.body.address ? req.body.address : company.address;
        company.phoneNo = req.body.phoneNo ? req.body.phoneNo : company.phoneNo;

        company.save(function (err, company) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|Error when updating company";
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating company.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated info of company:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ sucess: true, msg: "company is updated", data: company });
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting company.",
        error: error
      });
    }

  }


};
