const dateFormat = require("dateformat");

const programBenefitModel = require("../models/programBenefitModel");
const projectModel = require("../models/projectModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programBenefitModel.find(function (err, programBenefit) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programBenefit.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefit List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:programBenefit});
      }).populate('project', 'name').populate('nature', 'description').populate('assessmentResponsibility', 'username');
      //.populate('program', 'name').populate('projectManager', 'username').populate('nature', 'description').populate('assessmentResponsibility', 'username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programBenefit.",
        error: error
      });
    }

  },

  show: async function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programBenefitModel.find({ program: id}).populate('nature', 'description').populate('assessmentResponsibility', 'username').exec(function (err, programBenefit) {
      //.populate('program', 'name').populate('projectManager', 'username').populate('nature', 'description').populate('assessmentResponsibility', 'username').exec(function (err, programBenefit) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programBenefit.",
            error: err
          });
        }
        if (!programBenefit) {
          const LOGMESSAGE = DATETIME + "|No such programBenefit:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such programBenefit:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|programBenefit Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:programBenefit});
        // return res.json(programBenefit);
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programBenefit.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var programBenefit = new programBenefitModel({
      program:req.body.program,
      description:req.body.description,
      nature:req.body.nature,
      amount:req.body.amount,
      measurementApproach:req.body.measurementApproach,
      notes:req.body.notes,
      benefitStartDate:req.body.benefitStartDate,
      benefitDuration:req.body.benefitDuration,
      assessmentResponsibility:req.body.assessmentResponsibility,
      createdDate:req.body.createdDate,
      createdBy:req.body.createdBy   
      });
   
      programBenefit.save(function (err, programBenefit) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating Resource Change Request",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|programBenefit created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(programBenefit);
        return res.json({success:true,msg:"programBenefit is created",data:programBenefit});
      });   
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programBenefit.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programBenefitModel.findOne({ _id: id }, function (err, programBenefit) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting programBenefit",
            error: err
          });
        }
        if (!programBenefit) {
          const LOGMESSAGE = DATETIME + "|No such programBenefit to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such programBenefit"
          });
        }
       
        programBenefit.program= req.body['program']?req.body['program'] : programBenefit.program,
        programBenefit.description= req.body['description']?req.body['description'] : programBenefit.description,
        programBenefit.nature= req.body['nature']?req.body['nature'] : programBenefit.nature,
        programBenefit.amount= req.body['amount']?req.body['amount'] : programBenefit.amount,
        programBenefit.measurementApproach= req.body['measurementApproach']?req.body['measurementApproach'] : programBenefit.measurementApproach,
        programBenefit.notes= req.body['notes']?req.body['notes'] : programBenefit.notes,
        programBenefit.benefitStartDate= req.body['benefitStartDate']?req.body['benefitStartDate'] : programBenefit.benefitStartDate,
        programBenefit.benefitDuration= req.body['benefitDuration']?req.body['benefitDuration'] : programBenefit.benefitDuration,
        programBenefit.assessmentResponsibility= req.body['assessmentResponsibility']?req.body['assessmentResponsibility'] : programBenefit.assessmentResponsibility
        
        programBenefit.save(function (err, programBenefit) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating programBenefit.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated programBenefit:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"programBenefit is updated",data:programBenefit});
          // return res.json(programBenefit);
        });
      });  
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programBenefit.",
        error: error
      });
    }
    
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programBenefitModel.deleteOne({_id:id }, function (err, programBenefit) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the programBenefit.",
            error: err
          });
        }
        if (!programBenefit) {
          const LOGMESSAGE = DATETIME + "|programBenefit not found to delete|" +programBenefit;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(programBenefit.n >0){
          const LOGMESSAGE = DATETIME + "|removed programBenefit:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "programBenefit is deleted", programBenefit });
        }else{
          const LOGMESSAGE = DATETIME + "|removed programBenefit:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
        // return res.status(204).json();
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting programBenefit.",
        error: error
      });
    }

  },

};
