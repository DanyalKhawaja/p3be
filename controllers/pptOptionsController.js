const dateFormat = require("dateformat");
const pptOptionsModel = require("../models/pptOptionsModel");
const log = require('../lib/logger');

module.exports = {
    byPptId: function (req, res) {
        try {
          const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
          var id = req.params.pptId;         
          pptOptionsModel.find({ pptId: id })
          .exec(function (err, pptOptions) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success:false,
                msg: "Error when getting pptOptions.",
                error: err
              });
            }
            if (!pptOptions) {
              const LOGMESSAGE = DATETIME + "|No such pptOptions with pptID:"+id;
              log.write("ERROR", LOGMESSAGE);
              return res.status(404).json({
                success:false,
                msg: "No such pptOptions with pptID:"+id
              });
            }
            const LOGMESSAGE = DATETIME + "|pptOptions Found";
            log.write("INFO", LOGMESSAGE);
            return res.json({success:true,data:pptOptions});
            // return res.json(pptOptions);
          });    
        } catch (error) {
          const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting pptOptions.",
            error: error
          });
        }
      },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var pptOptions = new pptOptionsModel({
      name:req.body.name,
      pptId:req.body.pptId,
      createdBy: req.body.createdBy,
      createdDate: DATETIME,
      updatedBy: req.body.updatedBy,
      updatedDate: DATETIME           
      });
   
      pptOptions.save(function (err, pptOptions) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating pptOptions",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|pptOptions created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(pptOptions);
        return res.json({success:true,msg:"pptOptions is created",data:pptOptions});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptOptions.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptOptionsModel.findOne({ _id: id }, function (err, pptOptions) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting pptOptions",
            error: err
          });
        }
        if (!pptOptions) {
          const LOGMESSAGE = DATETIME + "|No such pptOptions to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such pptOptions"
          });
        }
      
        pptOptions.name= req.body['name']?req.body['name'] : pptOptions.name
        pptOptions.updatedBy = req.body.updatedBy
        pptOptions.updatedDate = DATETIME  
        
        pptOptions.save(function (err, pptOptions) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating pptOptions.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated pptOptions:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"pptOptions is updated",data:pptOptions});
          // return res.json(pptOptions);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptOptions.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      pptOptionsModel.deleteOne({_id:id }, function (err, pptOptions) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the pptOptions.",
            error: err
          });
        }
        if (!pptOptions) {
          const LOGMESSAGE = DATETIME + "|pptOptions not found to delete|" +pptOptions;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(pptOptions.n >0){
          const LOGMESSAGE = DATETIME + "|removed pptOptions:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "pptOptions is deleted", pptOptions });
        }else{
          const LOGMESSAGE = DATETIME + "|removed pptOptions:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no pptOptions found to delete with id:"+id });
        }
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting pptOptions.",
        error: error
      });
    }
  },
};
