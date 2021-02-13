const dateFormat = require("dateformat");

const programStakeholderModel = require("../models/programStakeholderModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programStakeholderModel.find(function (err, programStakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programStakeholder.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programStakeholder List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:programStakeholder});
      }).populate('role','description');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programStakeholder.",
        error: error
      });
    }

  },

  show: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      
      var id = req.params.id;
     
      programStakeholderModel.find({ program: id}).populate('role','description').exec(function (err, programStakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programStakeholder.",
            error: err
          });
        }
        if (!programStakeholder) {
          const LOGMESSAGE = DATETIME + "|No such programStakeholder:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such programStakeholder:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|programStakeholder Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:programStakeholder});
        // return res.json(programStakeholder);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programStakeholder.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var programStakeholder = new programStakeholderModel({
      program:req.body.program,
      role:req.body.role,
      name:req.body.name,
      email:req.body.email,
      phoneNo:req.body.phoneNo,
      levelSupportRequired:req.body.levelSupportRequired,
      levelSupportProvided:req.body.levelSupportProvided,
      impact:req.body.impact,
      riskRating:  Number(req.body.impact) * Number(req.body.levelSupportRequired),
      issues:req.body.issues,
      feedback:req.body.feedback,
      influenceStrategy:req.body.influenceStrategy,
      createdBy:req.body.createdBy    
      });
   
      programStakeholder.save(function (err, programStakeholder) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating Resource Change Request",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|programStakeholder created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(programStakeholder);
        return res.json({success:true,msg:"programStakeholder is created",data:programStakeholder});
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programStakeholder.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programStakeholderModel.findOne({ _id: id }, function (err, programStakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programStakeholder",
            error: err
          });
        }
        if (!programStakeholder) {
          const LOGMESSAGE = DATETIME + "|No such programStakeholder to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such programStakeholder"
          });
        }
       
        programStakeholder.program= req.body['program']?req.body['program'] : programStakeholder.program,
        programStakeholder.role= req.body['role']?req.body['role'] : programStakeholder.role,
        programStakeholder.name= req.body['name']?req.body['name'] : programStakeholder.name,
        programStakeholder.email= req.body['email']?req.body['email'] : programStakeholder.email,
        programStakeholder.phoneNo= req.body['phoneNo']?req.body['phoneNo'] : programStakeholder.phoneNo,
        programStakeholder.levelSupportRequired= req.body['levelSupportRequired']?req.body['levelSupportRequired'] : programStakeholder.levelSupportRequired,
        programStakeholder.levelSupportProvided= req.body['levelSupportProvided']?req.body['levelSupportProvided'] : programStakeholder.levelSupportProvided,
        programStakeholder.impact= req.body['impact']?req.body['impact'] : programStakeholder.impact,
        programStakeholder.riskRating= req.body['riskRating']?req.body['riskRating'] : programStakeholder.riskRating,
        programStakeholder.issues= req.body['issues']?req.body['issues'] : programStakeholder.issues,
        programStakeholder.feedback= req.body['feedback']?req.body['feedback'] : programStakeholder.feedback,
        programStakeholder.influenceStrategy= req.body['influenceStrategy']?req.body['influenceStrategy'] : programStakeholder.influenceStrategy
        
        
        programStakeholder.save(function (err, programStakeholder) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating programStakeholder.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated programStakeholder:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"programStakeholder is updated",data:programStakeholder});
          // return res.json(programStakeholder);
        });
      });  
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programStakeholder.",
        error: error
      });
    }
    
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programStakeholderModel.deleteOne({_id:id }, function (err, programStakeholder) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the programStakeholder.",
            error: err
          });
        }
        if (!programStakeholder) {
          const LOGMESSAGE = DATETIME + "|programStakeholder not found to delete|" +programStakeholder;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(programStakeholder.n >0){
          const LOGMESSAGE = DATETIME + "|removed programStakeholder:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programStakeholder is deleted", programStakeholder });
        }else{
          const LOGMESSAGE = DATETIME + "|removed programStakeholder:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
        // const LOGMESSAGE = DATETIME + "|removed programStakeholder:" + id;
        // log.write("INFO", LOGMESSAGE);
        // return res.json({success:true,msg:"programStakeholder is deleted", programStakeholder});
        // return res.status(204).json();
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programStakeholder.",
        error: error
      });
    }

  },

};
