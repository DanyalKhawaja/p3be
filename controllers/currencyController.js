const dateFormat = require("dateformat");
const currencyModel = require("../models/currencyModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      currencyModel.find(function (err, currency) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting currency.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Currency List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:currency});
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting currency.",
        error: error
      });
    }

  },

  showById: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.currencyId;
      currencyModel.findOne({ _id: id }, 'currencyname').populate("currency").exec(function (err, currency) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting currency.",
            error: err
          });
        }
        if (!currency) {
          const LOGMESSAGE = DATETIME + "|No such currency:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such currency:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|Currency Found:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:currency});
        // return res.json(currency);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting currency.",
        error: error
      });
    }

  },
 
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var currency = new currencyModel({
        name: req.body.name,
        description: req.body.description
      });
  
      currency.save(function (err, currency) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating currency",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Currency created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(currency);
        return res.json({success:true,msg:"currency is created",data:currency});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting currency.",
        error: error
      });
    }

  },

  
};
