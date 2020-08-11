const dateFormat = require("dateformat");

const lessonLearnedTypeModel = require("../models/lessonLearnedTypeModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      lessonLearnedTypeModel.find(function (err, lessonLearnedType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting lessonLearnedType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|lessonLearnedType List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:lessonLearnedType});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting lessonLearnedType.",
        error: error
      });
    }
  
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
     
      lessonLearnedTypeModel.find({ _id: id}).exec(function (err, lessonLearnedType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting lessonLearnedType.",
            error: err
          });
        }
        if (!lessonLearnedType) {
          const LOGMESSAGE = DATETIME + "|No such lessonLearnedType:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such lessonLearnedType:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|lessonLearnedType Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:lessonLearnedType});
        // return res.json(lessonLearnedType);
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting lessonLearnedType.",
        error: error
      });
    }
  
  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var lessonLearnedType = new lessonLearnedTypeModel({
  
      description:req.body.description         
      });
   
      lessonLearnedType.save(function (err, lessonLearnedType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when creating Resource Change Request",
              error: err
            });
          }
        const LOGMESSAGE = DATETIME + "|lessonLearnedType created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(lessonLearnedType);
        return res.json({success:true,msg:"lessonLearnedType is created",data:lessonLearnedType});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting lessonLearnedType.",
        error: error
      });
    }
   
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      lessonLearnedTypeModel.findOne({ _id: id }, function (err, lessonLearnedType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting lessonLearnedType",
            error: err
          });
        }
        if (!lessonLearnedType) {
          const LOGMESSAGE = DATETIME + "|No such lessonLearnedType to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such lessonLearnedType"
          });
        }
      
        lessonLearnedType.description= req.body['description']?req.body['description'] : lessonLearnedType.description
        
        lessonLearnedType.save(function (err, lessonLearnedType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating lessonLearnedType.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated lessonLearnedType:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"lessonLearnedType is updated",data:lessonLearnedType});
          // return res.json(lessonLearnedType);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting lessonLearnedType.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      lessonLearnedTypeModel.deleteOne({_id:id }, function (err, lessonLearnedType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the lessonLearnedType.",
            error: err
          });
        }
        if (!lessonLearnedType) {
          const LOGMESSAGE = DATETIME + "|lessonLearnedType not found to delete|" +lessonLearnedType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(lessonLearnedType.n >0){
          const LOGMESSAGE = DATETIME + "|removed lessonLearnedType:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "lessonLearnedType is deleted", lessonLearnedType });
        }else{
          const LOGMESSAGE = DATETIME + "|removed lessonLearnedType:" + id;
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "no task found to delete with id:"+id });
        }
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting lessonLearnedType.",
        error: error
      });
    }
  },

};
