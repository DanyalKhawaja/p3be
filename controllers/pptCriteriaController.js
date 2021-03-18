const dateFormat = require("dateformat");
const pptCriteriaModel = require("../models/pptCriteriaModel");
const log = require('../lib/logger');
const { Types}= require('mongoose');

module.exports = {
  get: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.pptId;         
      pptCriteriaModel.find()
      .exec(function (err, pptCriteria) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting pptCriteria.",
            error: err
          });
        }
        if (!pptCriteria) {
          const LOGMESSAGE = DATETIME + "|No such pptCriteria with pptID:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such pptCriteria with pptID:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|pptCriteria Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:pptCriteria});
        // return res.json(pptCriteria);
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptCriteria.",
        error: error
      });
    }
  },
    byPptId: function (req, res) {
        try {
          const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
          var id = req.params.pptId;         
          pptCriteriaModel.find({ pptId: id })
          .exec(function (err, pptCriteria) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success:false,
                msg: "Error when getting pptCriteria.",
                error: err
              });
            }
            if (!pptCriteria) {
              const LOGMESSAGE = DATETIME + "|No such pptCriteria with pptID:"+id;
              log.write("ERROR", LOGMESSAGE);
              return res.status(404).json({
                success:false,
                msg: "No such pptCriteria with pptID:"+id
              });
            }
            const LOGMESSAGE = DATETIME + "|pptCriteria Found";
            log.write("INFO", LOGMESSAGE);
            return res.json({success:true,data:pptCriteria});
            // return res.json(pptCriteria);
          });    
        } catch (error) {
          const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting pptCriteria.",
            error: error
          });
        }
      },
  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
    
      // var pptCriteria = new pptCriteriaModel({
      // name:req.body.name,
      // pptId:req.body.pptId,
      // createdBy: req.body.createdBy,
      // createdDate: DATETIME,
      // updatedBy: req.body.updatedBy,
      // updatedDate: DATETIME           
      // });
      req.body.forEach((d,i)=>{req.body[i]._id = Types.ObjectId(req.body[i]._id)});
      pptCriteriaModel.collection.insertMany(req.body,function (err, pptCriteria) {
      // pptCriteria.save(function (err, pptCriteria) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating pptCriteria",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|pptCriteria created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(pptCriteria);
        return res.json({success:true,msg:"pptCriteria is created",data:pptCriteria});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptCriteria.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptCriteriaModel.findOne({ _id: id }, function (err, pptCriteria) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting pptCriteria",
            error: err
          });
        }
        if (!pptCriteria) {
          const LOGMESSAGE = DATETIME + "|No such pptCriteria to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such pptCriteria"
          });
        }
      
        pptCriteria.name= req.body['name']?req.body['name'] : pptCriteria.name
        pptCriteria.updatedBy = req.body.updatedBy
        pptCriteria.updatedDate = DATETIME  
        
        pptCriteria.save(function (err, pptCriteria) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating pptCriteria.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated pptCriteria:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"pptCriteria is updated",data:pptCriteria});
          // return res.json(pptCriteria);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptCriteria.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptCriteriaModel.deleteOne({_id:id }, function (err, pptCriteria) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the pptCriteria.",
            error: err
          });
        }
        if (!pptCriteria) {
          const LOGMESSAGE = DATETIME + "|pptCriteria not found to delete|" +pptCriteria;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(pptCriteria.n >0){
          const LOGMESSAGE = DATETIME + "|removed pptCriteria:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "pptCriteria is deleted", pptCriteria });
        }else{
          const LOGMESSAGE = DATETIME + "|removed pptCriteria:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no pptCriteria found to delete with id:"+id });
        }
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptCriteria.",
        error: error
      });
    }
  },
};
