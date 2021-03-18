const dateFormat = require("dateformat");
const pptOVsOModel = require("../models/pptOVsOModel");
const log = require('../lib/logger');
const { ObjectId } = require('mongoose').Types;
module.exports = {
  byPptId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var pptId = req.params.pptId;
      pptOVsOModel.find({ pptId: ObjectId(pptId) }).sort({sequence: 1})
        .exec(function (err, ppt) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting ppt.",
              error: err
            });
          }
          if (!ppt) {
            const LOGMESSAGE = DATETIME + "|No such ppt:" + pptId + " & portfolio:" + pid;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success: false,
              msg: "|No such ppt:" + pptId + " & portfolio:" + pid
            });
          }
          const LOGMESSAGE = DATETIME + "|ppt Found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: ppt });
          // return res.json(ppt);
        });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting ppt.",
        error: error
      });
    }
  },

  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
    
      req.body.forEach((d,i)=>{req.body[i].pptId = ObjectId(req.body[i].pptId)})
      pptOVsOModel.collection.insertMany(req.body,function (err, ppt) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating ppt",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|ppt created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(ppt);

        //ppt._id


        return res.json({ success: true, msg: "ppt is created", data: ppt });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting ppt.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptOVsOModel.findOne({ _id: id }, function (err, pptOVsO) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting pptOVsO",
            error: err
          });
        }
        if (!pptOVsO) {
          const LOGMESSAGE = DATETIME + "|No such pptOVsO to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such pptOVsO"
          });
        }
        pptOVsO.criteriaId = req.body.criteriaId ? req.body.criteriaId : pptOVsO.criteriaId;
        pptOVsO.optionId1 = req.body.optionId1 ? req.body.optionId1 : pptOVsO.optionId1;
        pptOVsO.optionId2 = req.body.optionId2 ? req.body.optionId2 : pptOVsO.optionId2;
        pptOVsO.rowNo = req.body.rowNo ? req.body.rowNo : pptOVsO.rowNo;
        pptOVsO.columnNo = req.body.columnNo ? req.body.columnNo : pptOVsO.columnNo;
        pptOVsO.optionWeight = req.body.optionWeight ? req.body.optionWeight : pptOVsO.optionWeight;
        pptOVsO.updatedBy = req.body.updatedBy;
        pptOVsO.updatedDate = DATETIME;

        pptOVsO.save(function (err, pptOVsO) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating pptOVsO.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated pptOVsO:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "pptOVsO is updated", data: pptOVsO });
          // return res.json(ppt);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting pptOVsO.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptOVsOModel.deleteOne({ _id: id }, function (err, ppt) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the ppt.",
            error: err
          });
        }
        if (!ppt) {
          const LOGMESSAGE = DATETIME + "|ppt not found to delete|" + ppt;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if (ppt.n > 0) {
          const LOGMESSAGE = DATETIME + "|removed ppt:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "ppt is deleted", ppt });
        } else {
          const LOGMESSAGE = DATETIME + "|removed ppt:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no ppt found to delete with id:" + id });
        }
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting ppt.",
        error: error
      });
    }
  },
};
