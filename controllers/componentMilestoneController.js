const dateFormat = require("dateformat");

const componentMilestoneModel = require("../models/componentMilestoneModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      componentMilestoneModel.find(function (err, componentMilestone) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting componentMilestone.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|componentMilestone List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:componentMilestone});
      });
    } catch (error) {
      return res.status(500).json({
        success:false,
        msg: "Error when getting componentMilestone.",
        error: error
      });
    }

  },

  show: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      componentMilestoneModel.find({ programComponent: id}).populate('programComponent', 'name, program').exec(function (err, componentMilestone) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting componentMilestone.",
            error: err
          });
        }
        if (!componentMilestone) {
          const LOGMESSAGE = DATETIME + "|No such componentMilestone:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such componentMilestone:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|componentMilestone Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:componentMilestone});
        // return res.json(componentMilestone);
      });
    } catch (error) {
      return res.status(500).json({
        success:false,
        msg: "Error when getting componentMilestone.",
        error: error
      });
    }
  
  },

  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // var componentMilestone = new componentMilestoneModel({
    
    //   programComponent:req.body.programComponent,
    // name:req.body.name,
    // startDate:req.body.startDate,
    // endDate:req.body.endDate,
    // createdDate:req.body.createdDate,
    // createdBy:req.body.createdBy   
    // });
    try {
      componentMilestoneModel.create(req.body,function (err, componentMilestone) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Change Request",
            error: err
          });
        }
      const LOGMESSAGE = DATETIME + "|componentMilestone created";
      log.write("INFO", LOGMESSAGE);
      // return res.status(201).json(componentMilestone);
      return res.json({success:true,msg:"componentMilestone is created",data:componentMilestone});
    });
    } catch (error) {
      return res.status(500).json({
        success:false,
        msg: "Error when getting componentMilestone.",
        error: error
      });
    }

  },

  update: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      componentMilestoneModel.findOne({ _id: id }, function (err, componentMilestone) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting componentMilestone",
            error: err
          });
        }
        if (!componentMilestone) {
          const LOGMESSAGE = DATETIME + "|No such componentMilestone to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such componentMilestone"
          });
        }
       
        componentMilestone.component= req.body['component']?req.body['component'] : componentMilestone.component,
        componentMilestone.name= req.body['name']?req.body['name'] : componentMilestone.name,
        componentMilestone.startDate= req.body['startDate']?req.body['startDate'] : componentMilestone.startDate,
        componentMilestone.endDate= req.body['endDate']?req.body['endDate'] : componentMilestone.endDate
        
        componentMilestone.save(function (err, componentMilestone) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating componentMilestone.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated componentMilestone:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"componentMilestone is updated",data:componentMilestone});
          // return res.json(componentMilestone);
        });
      });
    } catch (error) {
      return res.status(500).json({
        success:false,
        msg: "Error when getting componentMilestone.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
    try {
      componentMilestoneModel.deleteOne({_id:id }, function (err, componentMilestone) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the componentMilestone.",
            error: err
          });
        }
        if (!componentMilestone) {
          const LOGMESSAGE = DATETIME + "|componentMilestone not found to delete|" +componentMilestone;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
  
        if(componentMilestone.n >0){
          const LOGMESSAGE = DATETIME + "|removed componentMilestone:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "componentMilestone is deleted", componentMilestone });
        }else{
          const LOGMESSAGE = DATETIME + "|removed componentMilestone:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
        // return res.status(204).json();
      });
    } catch (error) {
      return res.status(500).json({
        success:false,
        msg: "Error when getting componentMilestone.",
        error: error
      });
    }

  },

};
