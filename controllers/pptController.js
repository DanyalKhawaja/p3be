const dateFormat = require("dateformat");
const pptModel = require("../models/pptModel");
const log = require('../lib/logger');

module.exports = {
    byPortfolioPptId: function (req, res) {
        try {
          const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
          var pId = req.params.portfolioId;
          var pptId = req.params.pptId;         
          pptModel.find({$and: [{  portfolioId: pId },{ _id: pptId }]})
          .exec(function (err, ppt) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success:false,
                msg: "Error when getting ppt.",
                error: err
              });
            }
            if (!ppt) {
              const LOGMESSAGE = DATETIME + "|No such ppt:"+pptId + " & portfolio:" + pid;
              log.write("ERROR", LOGMESSAGE);
              return res.status(404).json({
                success:false,
                msg: "|No such ppt:"+pptId + " & portfolio:" + pid
              });
            }
            const LOGMESSAGE = DATETIME + "|ppt Found";
            log.write("INFO", LOGMESSAGE);
            return res.json({success:true,data:ppt});
            // return res.json(ppt);
          });    
        } catch (error) {
          const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting ppt.",
            error: error
          });
        }
      },
  byPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.portfolioId;     
      pptModel.find({ portfolioId: id}).exec(function (err, ppt) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting ppt.",
            error: err
          });
        }
        if (!ppt) {
          const LOGMESSAGE = DATETIME + "|No such ppt with portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such ppt with portfolio:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|ppt Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:ppt});
        // return res.json(ppt);
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ppt.",
        error: error
      });
    }
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var ppt = new pptModel({
      name:req.body.name,
      description:req.body.description,
      portfolioId:req.body.portfolioId,
      createdBy: req.body.createdBy,
      createdDate: DATETIME,
      updatedBy: req.body.updatedBy,
      updatedDate: DATETIME           
      });
   
      ppt.save(function (err, ppt) {
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
        return res.json({success:true,msg:"ppt is created",data:ppt});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ppt.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptModel.findOne({ _id: id }, function (err, ppt) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting ppt",
            error: err
          });
        }
        if (!ppt) {
          const LOGMESSAGE = DATETIME + "|No such ppt to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such ppt"
          });
        }
      
        ppt.name= req.body['name']?req.body['name'] : ppt.name
        ppt.description= req.body['description']?req.body['description'] : ppt.description
        ppt.updatedBy = req.body.updatedBy
        ppt.updatedDate = DATETIME  
        
        ppt.save(function (err, ppt) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating ppt.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated ppt:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"ppt is updated",data:ppt});
          // return res.json(ppt);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ppt.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptModel.deleteOne({_id:id }, function (err, ppt) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the ppt.",
            error: err
          });
        }
        if (!ppt) {
          const LOGMESSAGE = DATETIME + "|ppt not found to delete|" +ppt;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(ppt.n >0){
          const LOGMESSAGE = DATETIME + "|removed ppt:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "ppt is deleted", ppt });
        }else{
          const LOGMESSAGE = DATETIME + "|removed ppt:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no ppt found to delete with id:"+id });
        }
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting ppt.",
        error: error
      });
    }
  },
};
