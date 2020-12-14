const dateFormat = require("dateformat");

const projectLocationModel = require("../models/projectLocationModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      projectLocationModel.find(function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project location.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project location List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectLocation});
      }).populate('program','name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project.",
        error: error
      });
    }

  },
  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      projectLocationModel.find({ project: id}).exec(function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project location.",
            error: err
          });
        }
        if (!projectLocation) {
          const LOGMESSAGE = DATETIME + "|No such project location:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|project Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectLocation});
        // return res.json(project);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project.",
        error: error
      });
    }
  },
  getLocations: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.projectId;
      projectLocationModel.find({ project: id , pathType: {$in:['End','single']}}).exec(function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project location.",
            error: err
          });
        }
        if (!projectLocation) {
          const LOGMESSAGE = DATETIME + "|No such project location:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|project Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:projectLocation});
        // return res.json(project);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project.",
        error: error
      });
    }
  },

  create: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {

      // var projectLocation = new projectLocationModel({
      //   project: req.body.project,
      //   projectLocationName: req.body.projectLocationName,
      //   pathId: req.body.pathId,
      //   pathSeqNo: req.body.pathSeqNo,
      //   pathType: req.body.pathType,
      //   latitude: req.body.latitude,
      //   longitude: req.body.longitude,
      //   createdBy: req.body.createdBy
      // });
      
      projectLocationModel.insertMany(req.body, function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating project",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project location created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(project);
        return res.json({success:true,msg:"project location is created",data:projectLocation});
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project location.",
        error: error
      });
    }
  
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectLocationModel.findOne({ _id: id }, function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project location",
            error: err
          });
        }
        if (!projectLocation) {
          const LOGMESSAGE = DATETIME + "|No such project location to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project location"
          });
        }
  
        projectLocation.project= req.body.project? req.body.project: projectLocation.project;
        projectLocation.projectLocationName= req.body.projectLocationName? req.body.projectLocationName: projectLocation.projectLocationName;
        projectLocation.pathId= req.body.pathId? req.body.pathId: projectLocation.pathId;
        projectLocation.pathSeqNo- req.body.pathSeqNo? req.body.pathSeqNo: projectLocation.pathSeqNo;
        projectLocation.pathType= req.body.pathType? req.body.pathType: projectLocation.pathType;
        projectLocation.latitude= req.body.latitude? req.body.latitude: projectLocation.latitude;
        projectLocation.longitude= req.body.longitude? req.body.longitude: projectLocation.longitude;
   
        //project.updatedBy= req.body.updatedBy?req.body.updatedBy: project.updatedBy;
        projectLocation.updatedDate = DATETIME;
    
        projectLocation.save(function (err, project) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating project location.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated project location:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"project location is updated",data:project});
        });
      });    
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project location.",
        error: error
      });
    }
  
  },
  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectLocationModel.findByIdAndRemove(id, function (err, projectLocation) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the project location.",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|project locationnot found to delete|" +projectLocation;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed project location:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"project location is deleted"});
        // return res.status(204).json();
      });
      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting project location.",
        error: error
      });
    }

  }
};
