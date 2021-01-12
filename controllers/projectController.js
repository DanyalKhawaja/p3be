const dateFormat = require("dateformat");

const projectModel = require("../models/projectModel");
const programModel = require("../models/programModel");
const componentMilestoneModel = require("../models/componentMilestoneModel");
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      projectModel.find({program: null},function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:project});
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
  locked: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      projectModel.find({ program:  { $in:  req.body.programs}  },function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:project});
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
      var id = req.params.id;
      projectModel.findOne({ _id: id }).populate('program','name').populate('projectType').exec(function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|No such project:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|project Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:project});
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
  showByProgramId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.find({ program: id }, function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|NO Such project of program:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
        const LOGMESSAGE = DATETIME + "|project found of program:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:project});
        // return res.json(project);
      }).populate('manager','username');
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
  showByPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ portfolio: id },{_id: 1}, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such project of portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
        var programs = [];
        program.forEach(
          function(row) {
             programs.push(row._id);
          });
          console.log(programs)
        projectModel.find({program:programs},function (err, project) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when getting project.",
              error: err
            });
          }
          if (!project) {
            const LOGMESSAGE = DATETIME + "|NO Such project of portfolio:"+id;
            log.write("ERROR", LOGMESSAGE);
            return res.status(404).json({
              success:false,
              msg: "No such project"
            });
          }
          const LOGMESSAGE = DATETIME + "|project List found";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,data:project});
        });
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
  showLocationById: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.findOne({ _id: id },"projectLocation", function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project.",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|NO Such project of portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
          const LOGMESSAGE = DATETIME + "|project List found";
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,data:project});
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
  createComponent: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var project = new projectModel({
            name: req.body.name,
            program: req.body.program,
            expectedStartDate: req.body.expectedStartDate,
            expectedEndDate: req.body.expectedEndDate,
            createdBy: req.body.createdBy,
       });

      project.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
        name: milestone.name,
        startDate: milestone.startDate,
        endDate: milestone.endDate,
        createdBy: milestone.createdBy
      })));
  
      project.save(function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating project",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(project);
        return res.json({success:true,msg:"project is created",data:project});
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

  updateComponent: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.findOne({ _id: id }, function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|No such project to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
  
        project.name= req.body.name? req.body.name: project.name;
        project.program= req.body.program? req.body.program: project.program;
        project.managementReserve=req.body.managementReserve? req.body.managementReserve:project.managementReserve;
        project.expectedStartDate= req.body.expectedStartDate? req.body.expectedStartDate: project.expectedStartDate;
        project.expectedEndDate= req.body.expectedEndDate? req.body.expectedEndDate: project.expectedEndDate;
        project.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
          name: milestone.name,
          startDate: milestone.startDate,
          endDate: milestone.endDate,
          createdBy: milestone.createdBy
        })));
        project.updatedBy= req.body.updatedBy?req.body.updatedBy: project.updatedBy;
        project.updatedDate = DATETIME;
    
        project.save(function (err, project) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating project.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated project:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"project is updated",data:project});
          // return res.json(project);
        });
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
  updatefromProgram: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.findOne({ _id: id }, function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|No such project to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
  
        project.name= req.body.name? req.body.name: project.name;
        project.manager= req.body.manager? req.body.manager: project.manager;
       
    
        project.save(function (err, project) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating project.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated project:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"project is updated",data:project});
          // return res.json(project);
        });
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
     
      var project = new projectModel({
            name: req.body.name,
            description: req.body.description,
            program: req.body.program,
            projectType: req.body.projectType,
            projectLocation: req.body.projectLocation,
            managementReserve: req.body.managementReserve,
            totalEstimatedBudget: req.body.totalEstimatedBudget,
            expectedStartDate: req.body.expectedStartDate,
            expectedEndDate: req.body.expectedEndDate,
            currency: req.body.currency,
            notes: req.body.notes,
            graphLabels: req.body.graphLabels,
            manager: req.body.manager,
            createdBy: req.body.createdBy

      });
      // console.log(req.body);
 

      // project.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
      //   name: milestone.name,
      //   startDate: milestone.startDate,
      //   endDate: milestone.endDate,
      //   createdBy: milestone.createdBy
      // })));
  
      project.save(function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating project",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|project created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(project);
        return res.json({success:true,msg:"project is created",data:project});
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

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.findOne({ _id: id }, function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting project",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|No such project to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such project"
          });
        }
        project.status= req.body.status? req.body.status: project.status;
        project.name= req.body.name? req.body.name: project.name;
        project.description= req.body.description? req.body.description: project.description;
        project.program= req.body.program? req.body.program: project.program;
        project.projectType= req.body.projectType? req.body.projectType: project.projectType;
        project.managementReserve= req.body.managementReserve? req.body.managementReserve: project.managementReserve;
        project.projectLocation= req.body.projectLocation? req.body.projectLocation: project.projectLocation;
        project.totalEstimatedBudget= req.body.totalEstimatedBudget? req.body.totalEstimatedBudget: project.totalEstimatedBudget;
        project.expectedStartDate= req.body.expectedStartDate? req.body.expectedStartDate: project.expectedStartDate;
        project.expectedEndDate= req.body.expectedEndDate? req.body.expectedEndDate: project.expectedEndDate;
        project.notes= req.body.notes? req.body.notes: project.notes;
        project.manager =  req.body.manager ? req.body.manager : project.manager;
        project.graphLabel =  req.body.graphLabels ?  req.body.graphLabels : project.graphLabel;
        // project.milestones =  req.body.milestones.map(milestone => (new componentMilestoneModel({
        //   name: milestone.name,
        //   startDate: milestone.startDate,
        //   endDate: milestone.endDate,
        //   createdBy: milestone.createdBy
        // })));
        project.updatedBy= req.body.updatedBy?req.body.updatedBy: project.updatedBy;
        project.updatedDate = DATETIME;
    
        project.save(function (err, project) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating project.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated project:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"project is updated",data:project});
          // return res.json(project);
        });
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
  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      projectModel.findByIdAndRemove(id, function (err, project) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the project.",
            error: err
          });
        }
        if (!project) {
          const LOGMESSAGE = DATETIME + "|project not found to delete|" +project;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed project:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"project is deleted"});
        // return res.status(204).json();
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

  }
};
