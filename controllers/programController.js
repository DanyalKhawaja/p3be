const dateFormat = require("dateformat");

const programModel = require("../models/programModel");

const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      programModel.find({portfolio: null},function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|program List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:program});
      })
      .populate('manager','username')
      .populate('sponsor','username');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }
  },
  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id })
      .populate('portfolio','name')
      .populate('manager','username')
      .populate('sponsor','username').exec(function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|No such program:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program:"+id
          });
        }
        const LOGMESSAGE = DATETIME + "|program Found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:program});
        // return res.json(program);
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  showByPortfolioId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ portfolio: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:program});
        // return res.json(program);
      });  
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }
    
  },
  lockedList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ locked: true }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:program});
        // return res.json(program);
      });  
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }
    
  },
  openList: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.find({ locked: false }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|NO Such program of portfolio:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program"
          });
        }
        const LOGMESSAGE = DATETIME + "|program found of portfolio:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:program});
        // return res.json(program);
      });  
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }
    
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var program = new programModel({
            portfolio: req.body.portfolio,
            name: req.body.name,
            startDate: req.body.startDate,
            currency: req.body.currency,
            endDate: req.body.endDate,
            periodFrom: req.body.periodFrom,
            periodTo: req.body.periodTo,
            status: req.body.status,
            manager: req.body.manager,
            sponsor: req.body.sponsor,
            createdBy: req.body.createdBy,
            createdDate: req.body.createdDate,
            budgetRequired: req.body.budgetRequired
      });
  
      program.save(function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating program",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|program created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(program);
        return res.json({success:true,msg:"program is created",data:program});
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|No such program to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program"
          });
        }
  
 
    program.portfolio = req.body.portfolio? req.body.portfolio : program.portfolio,
        program.name = req.body.name? req.body.name: program.name,
        program.startDate= req.body.startDate?req.body.startDate: program.startDate,
        program.endDate= req.body.endDate?req.body.endDate: program.endDate,
        program.status= req.body.status?req.body.status: program.status,
        program.manager= req.body.manager? req.body.manager: program.manager,
        program.sponsor= req.body.sponsor? req.body.sponsor: program.sponsor,
       
        
        program.createdBy= req.body.createdBy?req.body.createdBy: program.createdBy

        
    
        program.save(function (err, program) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating program.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated program:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"program is updated",data:program});
          // return res.json(program);
        });
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
  lock: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findOne({ _id: id }, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting program",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|No such program to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such program"
          });
        }
  
    program.locked = true;
    program.lockedOn = DATETIME,

        
    
        program.save(function (err, program) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success:false,
              msg: "Error when updating program.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Updated program:"+id;
          log.write("INFO", LOGMESSAGE);
          return res.json({success:true,msg:"program is updated",data:program});
          // return res.json(program);
        });
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }

  },
 
  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      programModel.findByIdAndRemove(id, function (err, program) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the program.",
            error: err
          });
        }
        if (!program) {
          const LOGMESSAGE = DATETIME + "|program not found to delete|" +program;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        const LOGMESSAGE = DATETIME + "|removed program:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,msg:"program is deleted"});
        // return res.status(204).json();
      });      
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting program.",
        error: error
      });
    }

  }
};
