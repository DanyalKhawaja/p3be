const dateFormat = require("dateformat");
const Promise = require("bluebird");

const issueLogModel = require("../models/issueLogModel");
const issueUpdateModel = require("../models/issueUpdateModel");
const log = require("../lib/logger");

//uncomment below 2 lines for options 1 in latestListByProjectId
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

module.exports = {
   list: function(req, res) {
      try {
         const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
         issueLogModel.find(function(err, issueLog) {
            if (err) {
               const LOGMESSAGE = DATETIME + "|" + err.message;
               log.write("ERROR", LOGMESSAGE);
               return res.status(500).json({
                  success: false,
                  msg: "Error when getting issueLog.",
                  error: err
               });
            }
            const LOGMESSAGE = DATETIME + "|issue Log List found";
            log.write("INFO", LOGMESSAGE);
            return res.json({
               success: true,
               data: issueLog
            });
         });
      } catch (error) {
         const LOGMESSAGE = DATETIME + "|" + error.message;
         log.write("ERROR", LOGMESSAGE);
         return res.status(500).json({
            success: false,
            msg: "Error when getting issueLog.",
            error: error
         });
      }
   },

   latestListByProjectId: function(req, res) {
      try {
         const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
         var id = req.params.id;

         //option 1 **********************
         // line number 9 & 10 should be uncommented
         
         
         issueLogModel.aggregate([
            {$match: {"project":ObjectId(id)}},
            { $project: {  description: 1, project: 1, lastLog: { $slice: [ "$logs", -1 ] } }, }
            , { $unwind : "$lastLog" },
            ,{
               "$lookup": {
                 "from": "project",
                 "localField": "project",
                 "foreignField": "_id",
                 "as": "project"
               }
            }
         //   , { $unwind : "$lastLog.issueCategory" }
            ,{
               "$lookup": {
                 "from": "issuecategories",
                 "localField": "lastLog.category",
                 "foreignField": "_id",
                 "as": "lastLog.issueCategory"
               }
            }
           , { $unwind : "$lastLog.issueCategory" }
            ,{
               "$lookup": {
                 "from": "issuetypes",
                 "localField": "lastLog.issueType",
                 "foreignField": "_id",
                 "as": "lastLog.issueType"
               }
            }
           , { $unwind : "$lastLog.issueType" }
         ])
         
            
              // option 2 ****************************
            // issueLogModel.find({project:id}, {logs: { "$slice": -1 }})
            // .populate("project","name")
            // .populate("logs.category")
            // .populate("logs.issueType")


               
         .exec(function(err, issueLog) {
            if (err) {
               const LOGMESSAGE = DATETIME + "|" + err.message;
               log.write("ERROR", LOGMESSAGE);
               return res.status(500).json({
                  success: false,
                  msg: "Error when getting issue Log.",
                  error: err
               });
            }
            const LOGMESSAGE = DATETIME + "|issue Log List found";
            log.write("INFO", LOGMESSAGE);
            return res.json({
               success: true,
               data: issueLog
            });
         });
      } catch (error) {
         const LOGMESSAGE = DATETIME + "|" + error.message;
         log.write("ERROR", LOGMESSAGE);
         return res.status(500).json({
            success: false,
            msg: "Error when getting issueLog.",
            error: error
         });
      }
   },
  
   listByProjectId: function(req, res) {
      try {
         const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
         var id = req.params.id;
         issueLogModel.find({
            project: id
         }, function(err, issueLog) {
            if (err) {
               const LOGMESSAGE = DATETIME + "|" + err.message;
               log.write("ERROR", LOGMESSAGE);
               return res.status(500).json({
                  success: false,
                  msg: "Error when getting issueLog.",
                  error: err
               });
            }
            const LOGMESSAGE = DATETIME + "|issue Log List found";
            log.write("INFO", LOGMESSAGE);
            return res.json({
               success: true,
               data: issueLog
            });
         });
      } catch (error) {
         const LOGMESSAGE = DATETIME + "|" + error.message;
         log.write("ERROR", LOGMESSAGE);
         return res.status(500).json({
            success: false,
            msg: "Error when getting issueLog.",
            error: error
         });
      }
   },

   create: function(req, res) {
      try {
         const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
         var issueLog = new issueLogModel({
            project: req.body.project,
            description: req.body.description,
            logs: req.body.logs
         });

         issueLog.save(function(err, issueLog) {
            if (err) {
               const LOGMESSAGE = DATETIME + "|" + err.message;
               log.write("ERROR", LOGMESSAGE);
               return res.status(500).json({
                  success: false,
                  msg: "Error when creating issue Log",
                  error: err
               });
            }
            const LOGMESSAGE = DATETIME + "|issue Log created";
            log.write("INFO", LOGMESSAGE);
            // return res.Log(201).json(issue Log);
            return res.json({
               success: true,
               msg: "issue Log is created",
               data: issueLog
            });
         });
      } catch (error) {
         const LOGMESSAGE = DATETIME + "|" + error.message;
         log.write("ERROR", LOGMESSAGE);
         return res.status(500).json({
            success: false,
            msg: "Error when creating issue Log",
            error: error
         });
      }
   },

   update: function(req, res) {
      try {
         const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
         var id = req.params.id;
         issueLogModel.findOne({
            _id: id
         }, function(err, issueLog) {
            if (err) {
               const LOGMESSAGE = DATETIME + "|" + err.message;
               log.write("ERROR", LOGMESSAGE);
               return res.status(500).json({
                  success: false,
                  msg: "Error when getting issue Log",
                  error: err
               });
            }
            if (!issueLog) {
               const LOGMESSAGE = DATETIME + "|No such issue Log to update";
               log.write("ERROR", LOGMESSAGE);
               return res.status(404).json({
                  success: false,
                  msg: "No such issue Log"
               });
            }
            issueLog.logs.push(req.body);
            issueLog.save(function(err, issueLog) {
               if (err) {
                  const LOGMESSAGE = DATETIME + "|" + err.message;
                  log.write("ERROR", LOGMESSAGE);
                  return res.status(500).json({
                     success: false,
                     msg: "Error when updating issue Log.",
                     error: err
                  });
               }
               const LOGMESSAGE = DATETIME + "|Saved issue Log";
               log.write("INFO", LOGMESSAGE);
               return res.json({
                  success: true,
                  msg: "issue Log is updated",
                  data: issueLog
               });
               // return res.json(issue Log);
            });
         });
      } catch (error) {
         const LOGMESSAGE = DATETIME + "|" + error.message;
         log.write("ERROR", LOGMESSAGE);
         return res.status(500).json({
            success: false,
            msg: "Error when creating issue Log",
            error: error
         });
      }
   }
};
