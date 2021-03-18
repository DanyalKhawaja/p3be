const dateFormat = require("dateformat");
const pptCVsCModel = require("../models/pptCVsCModel");
const log = require('../lib/logger');
const { ObjectId } = require('mongoose').Types;

module.exports = {
  byPptId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var pptId = req.params.pptId;
      pptCVsCModel.find({ pptId: ObjectId(pptId) }).sort({sequence: 1})
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
  byPptIdEnabled: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var pptId = req.params.pptId;
      pptCVsCModel.find({ _id: pptId, disabled: false })
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
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      req.body.forEach((d,i)=>{req.body[i].pptId = ObjectId(req.body[i].pptId)})
      pptCVsCModel.collection.insertMany(req.body, function (err, ppt) {
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
      pptCVsCModel.findOne({ _id: id }, function (err, pptCVsC) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting pptCVsC",
            error: err
          });
        }
        if (!pptCVsC) {
          const LOGMESSAGE = DATETIME + "|No such pptCVsC to update:" + id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such pptCVsC"
          });
        }
        pptCVsC.criteriaId = req.body.criteriaId ? req.body.criteriaId : pptCVsC.criteriaId;
        pptCVsC.criteriaId1 = req.body.criteriaId1 ? req.body.criteriaId1 : pptCVsC.criteriaId1;
        pptCVsC.criteriaId2 = req.body.criteriaId2 ? req.body.criteriaId2 : pptCVsC.criteriaId2;
        pptCVsC.rowNo = req.body.rowNo ? req.body.rowNo : pptCVsC.rowNo;
        pptCVsC.columnNo = req.body.columnNo ? req.body.columnNo : pptCVsC.columnNo;
        pptCVsC.criteriaWeight = req.body.criteriaWeight ? req.body.criteriaWeight : pptCVsC.criteriaWeight;
        pptCVsC.updatedBy = req.body.updatedBy;
        pptCVsC.updatedDate = DATETIME;

        pptCVsC.save(function (err, pptCVsC) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating pptCVsC.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated pptCVsC:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "pptCVsC is updated", data: pptCVsC });
          // return res.json(ppt);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting pptCVsC.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptCVsCModel.deleteOne({ _id: id }, function (err, ppt) {
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
