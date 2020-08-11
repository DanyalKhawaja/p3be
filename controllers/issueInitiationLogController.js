const dateFormat = require("dateformat");
const Promise = require('bluebird');

const issueInitiationLogModel = require("../models/issueInitiationLogModel");
const issueResolutionLogModel = require("../models/issueResolutionLogModel");
const issueUpdateModel = require("../models/issueUpdateModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      issueInitiationLogModel.find(function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting issueInitiationLog.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue InitiationLog List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: issueInitiationLog });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting issueInitiationLog.",
        error: error
      });
    }

  },
  listByProjectIdtry: function (req, res) {
    try {
      let promise = new Promise(function (resolve, reject) {
        const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var id = req.params.id;
        console.log('---promise')
        issueInitiationLogModel.find({ project: id }, function (err, issueInitiationLog) {
          if (err) {
            reject(err)
          }
          if (issueInitiationLog) {
            resolve(issueInitiationLog)
          }
        });
      });
      promise.then((result) => {
        // Auto login
        var finalIssueInitiationLog = result
        // console.log(typeof finalIssueInitiationLog, finalIssueInitiationLog[0])
        // console.log('--then')
        // console.log(result)
        result.forEach(async (row, i) => {
          var l = await getData(row, i)
          console.log('--get', l)

        });
        var arr = [];
        // return Promise.map(result, (row, index) => getData(row, result[index])).then(res=>{
        //  console.log('----')
        //   console.log(res,'---res')
        // });

        // return { session: 'sjhgssgsg16775vhg765' };
      }).then(function (result) {
        // Present WhatsNew and some options
        // console.log('--finally')
        // console.log(result)
        return res.json(result);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting issueInitiationLog.",
        error: error
      });
    }
  },

  listByProjectIdtry2: function (req, res) {
    // try {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    issueInitiationLogModel.find({ project: id }).then((err, issueInitiationLog) => {
      if (err) {

      }
      var arrResolution = [];
      var arrIussueUpdate = []
      if (issueInitiationLog) {
        issueInitiationLog.forEach((row, i) => {
          arrResolution.push(issueResolutionLogModel.find({ issue: row._id }))
          // arrIussueUpdate.push(  issueResolutionLogModel.find({issue:row._id})
        });
      }
      console.log(arrResolution)
      return Promise.all(issueInitiationLog);
    }).then((result) => {
      // var resArr = []
      // issueInitiationLog.forEach((row, i)=>{
      //   resArr.push({
      //     "issueInitiationLog":issueInitiationLog[i],
      //     "issueResolutionLog":result[i]
      //   })
      // })
      res.json(result)
    }).catch(function (error) {
      res.json({ success: false, error: error });
    });
    // } catch (error) {
    //   // const LOGMESSAGE = DATETIME + "|" + error.message;
    //   // log.write("ERROR", LOGMESSAGE);
    //   return res.status(500).json({
    //     success: false,
    //     msg: "Error when getting issueInitiationLog.",
    //     error: error
    //   });
    // }

  },
  listByProjectIdFinal: function (req, res) {
    // try {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var isArrayEmpty = arr => !arr.filter(elem => true).length;
    var id = req.params.id;
    let issueLogArr = []
    let resolitionLogArr = []
    let issueUpdateArr = []
    getIssueLog(id).then((issueLog) => {
      issueLogArr = issueLog
      return Promise.map(issueLog, (col) => getResulotionLog(col));
    }).then(data => {
      
      // resolitionLogArr = data.filter(subarray => !isArrayEmpty(subarray))
      resolitionLogArr = data
      return Promise.map(issueLogArr, (col) => getIssueUpdate(col));
    })
      // .then((dd) => {
      //   issueUpdateArr = dd
      //   var teArr = []
      //   return Promise.all(issueLogArr.map(function (item,i) {
      //     item.reso = resolitionLogArr[i]
      //     return item;
      // }));

      // })
      .then(resp => {

        //  issueUpdateArr = resp.filter(subarray => !isArrayEmpty(subarray))
        issueUpdateArr = resp
        res.json({
          success: true,
          data: { issueLog: issueLogArr, resolutionLog: resolitionLogArr, issueUpdateLog: issueUpdateArr }
        })
      })
  },

  listByProjectId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      issueInitiationLogModel.find(function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting issueInitiationLog.",
            error: err
          });
        }
        var arr = []
        issueInitiationLog.forEach(
          function(row) {
            arr.push(row._id);
          });
          var resArr;
        issueResolutionLogModel.find({issue:arr},function (err, resolutionLog) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting issueInitiationLog.",
              error: err
            });
          }
          if(resolutionLog){
            resArr = resolutionLog
            // const LOGMESSAGE = DATETIME + "|issue InitiationLog List found";
            // log.write("INFO", LOGMESSAGE);
            // return res.json({ success: true, data: {ini:issueInitiationLog,re:resArr} });
          }
        });
        issueUpdateModel.find({issue:arr},function (err, updateLog) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when getting issueInitiationLog.",
              error: err
            });
          }
          if(updateLog && resArr){
            // resArr = resolutionLog
            const LOGMESSAGE = DATETIME + "|issue InitiationLog List found";
            log.write("INFO", LOGMESSAGE);
            return res.json({ success: true, data: {issueInitiationLog:issueInitiationLog,resolutionLog:resArr,updateLog:updateLog} });
          }
        })
   
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting issueInitiationLog.",
        error: error
      });
    }

  },
  listByIssueId: function (req, res) {
    // try {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var id = req.params.id;
    let resolutionArr = []
    let issueUpdateArr = []
    getResulotionLog({_id:id}).then((resolutionLog) => {
      resolutionArr = resolutionLog
      return getIssueUpdate({_id:id});
    })
      .then(resp => {
        // var isArrayEmpty = arr => !arr.filter(elem => true).length;
        //  issueUpdateArr = resp.filter(subarray => !isArrayEmpty(subarray))
        issueUpdateArr = resp
        res.json({
          success: true,
          data: {resolutionLog: resolutionArr, issueUpdateLog: issueUpdateArr }
        })
      })
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var issueInitiationLog = new issueInitiationLogModel({
        project: req.body.project,
        description: req.body.description,
        category: req.body.category,
        issueCreateDate: req.body.issueCreateDate,
        requestedBy: req.body.requestedBy,
        issueType: req.body.issueType,
        urgency: req.body.urgency,
        createdDate: req.body.createDate,
        createdBy: req.body.createdBy
      });

      issueInitiationLog.save(function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating issue InitiationLog",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|issue InitiationLog created";
        log.write("INFO", LOGMESSAGE);
        // return res.InitiationLog(201).json(issue InitiationLog);
        return res.json({ success: true, msg: "issue InitiationLog is created", data: issueInitiationLog });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when creating issue InitiationLog",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueInitiationLogModel.findOne({ _id: id }, function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting issue InitiationLog",
            error: err
          });
        }
        if (!issueInitiationLog) {
          const LOGMESSAGE = DATETIME + "|No such issue InitiationLog to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such issue InitiationLog"
          });
        }


        issueInitiationLog.project = req.body.project ? req.body.project : issueInitiationLog.project;
        issueInitiationLog.description = req.body.description ? req.body.description : issueInitiationLog.description;
        issueInitiationLog.category = req.body.category ? req.body.category : issueInitiationLog.category;
        issueInitiationLog.issueCreateDate = req.body.issueCreateDate ? req.body.issueCreateDate : issueInitiationLog.issueCreateDate;
        issueInitiationLog.requestedBy = req.body.requestedBy ? req.body.requestedBy : issueInitiationLog.requestedBy;
        issueInitiationLog.issueType = req.body.issueType ? req.body.issueType : issueInitiationLog.issueType;
        issueInitiationLog.urgency = req.body.urgency ? req.body.urgency : issueInitiationLog.urgency;


        issueInitiationLog.save(function (err, issueInitiationLog) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating issue InitiationLog.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved issue InitiationLog";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "issue InitiationLog is updated", data: issueInitiationLog });
          // return res.json(issue InitiationLog);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when creating issue InitiationLog",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      issueInitiationLogModel.findByIdAndRemove(id, function (err, issueInitiationLog) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the issue InitiationLog.",
            error: err
          });
        }
        if (!issueInitiationLog) {
          const LOGMESSAGE = DATETIME + "|issueInitiationLog not found to delete|" + issueInitiationLog;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed issue InitiationLog:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "issue InitiationLog is deleted" });
        // return res.InitiationLog(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when creating issue InitiationLog",
        error: error
      });
    }

  }
};

function getData(row, finalIssueInitiationLog) {
  // let promise2 = new Promise(function (resolve, reject) {

  // });
  // console.log(finalIssueInitiationLog)
  issueResolutionLogModel.find({ issue: row._id }, async (err, issueResolutionLog) => {
    if (err) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return {
        success: false,
        msg: "Error when getting issueInitiationLog.",
        error: err
      }

    }
    // console.log( issueResolutionLog.length)
    // console.log(finalIssueInitiationLog,'--final init')
    // var merge =[];
    // if(issueResolutionLog && issueResolutionLog.length> 0){
    console.log('--issue log')
    // finalIssueInitiationLog[i]["resolution"] = issueResolutionLog;
    // finalIssueInitiationLog[i]["er"] = "s"
    var merge = await Object.assign({ issueResolutionLog, finalIssueInitiationLog });
    // console.log(merge)
    // if(result.length == i+1){
    // const LOGMESSAGE = DATETIME + "|issue InitiationLog List found";
    // log.write("INFO", LOGMESSAGE);
    return { success: true, data: merge };
    // }
    // }

  });
}

function getIssueLog(id) {
  return Promise.resolve(issueInitiationLogModel.find({ project: id }));
}
function getResulotionLog(row) {
  return Promise.resolve(issueResolutionLogModel.find({ issue: row._id }).populate("issue"));
}
function getIssueUpdate(row) {
  return Promise.resolve(issueUpdateModel.find({ issue: row._id }).populate("issue"));
}

