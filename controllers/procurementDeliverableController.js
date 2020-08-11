const dateFormat = require("dateformat");

const procurementDeliverableModel = require("../models/procurementDeliverableModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      procurementDeliverableModel.find(function (err, procurementDeliverable) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting procurementDeliverable.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|procurementDeliverable List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:procurementDeliverable});
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting procurementDeliverable.",
        error: error
      });
    }
  
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
     
      procurementDeliverableModel.find({ procurement: id}).exec(function (err, procurementDeliverable) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting procurementDeliverable.",
            error: err
          });
        }
        if (!procurementDeliverable) {
          const LOGMESSAGE = DATETIME + "|No such procurementDeliverable:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such procurementDeliverable:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|procurementDeliverable Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:procurementDeliverable});
        // return res.json(procurementDeliverable);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting procurementDeliverable.",
        error: error
      });
    }

  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var procurementDeliverable = new procurementDeliverableModel({
       
      procurement:req.body.procurement,
      deliverable:req.body.deliverable,
      targetDate:req.body.targetDate,
      status:req.body.status
      });
   
      procurementDeliverable.save(function (err, procurementDeliverable) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating Resource Change Request",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|procurementDeliverable created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(procurementDeliverable);
        return res.json({success:true,msg:"procurementDeliverable is created",data:procurementDeliverable});
      });     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting procurementDeliverable.",
        error: error
      });
    }
 
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      procurementDeliverableModel.findOne({ _id: id }, function (err, procurementDeliverable) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting procurementDeliverable",
            error: err
          });
        }
        if (!procurementDeliverable) {
          const LOGMESSAGE = DATETIME + "|No such procurementDeliverable to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such procurementDeliverable"
          });
        }
       
        procurementDeliverable.procurement= req.body['procurement']?req.body['procurement'] : procurementDeliverable.procurement,
        procurementDeliverable.deliverable= req.body['deliverable']?req.body['deliverable'] : procurementDeliverable.deliverable,
        procurementDeliverable.targetDate= req.body['targetDate']?req.body['targetDate'] : procurementDeliverable.targetDate,
        procurementDeliverable.status= req.body['status']?req.body['status'] : procurementDeliverable.status
        
        procurementDeliverable.save(function (err, procurementDeliverable) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating procurementDeliverable.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated procurementDeliverable:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"procurementDeliverable is updated",data:procurementDeliverable});
          // return res.json(procurementDeliverable);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting procurementDeliverable.",
        error: error
      });
    }
  
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      procurementDeliverableModel.deleteOne({_id:id }, function (err, procurementDeliverable) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the procurementDeliverable.",
            error: err
          });
        }
        if (!procurementDeliverable) {
          const LOGMESSAGE = DATETIME + "|procurementDeliverable not found to delete|" +procurementDeliverable;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(procurementDeliverable.n >0){
          const LOGMESSAGE = DATETIME + "|removed procurementDeliverable:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "procurementDeliverable is deleted", procurementDeliverable });
        }else{
          const LOGMESSAGE = DATETIME + "|removed procurementDeliverable:" + id;
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
        msg: "Error when getting procurementDeliverable.",
        error: error
      });
    }
  
  },

};
