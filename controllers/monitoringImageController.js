const dateFormat = require("dateformat");
var fs = require('fs');

const monitoringImageModel = require("../models/monitoringImageModel");

const upload = require('../lib/upload')
const log = require('../lib/logger');

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      monitoringImageModel.find(function (err, monitoringImage) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting monitoringImage.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoringImage List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:monitoringImage});
      });     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }
 
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
       monitoringImageModel.findOne({ _id: id }).exec(function (err, monitoringImage) {
         if (err) {
           const LOGMESSAGE = DATETIME + "|" + err.message;
           log.write("ERROR", LOGMESSAGE);
           return res.status(500).json({
             success:false,
             msg: "Error when getting monitoringImage.",
             error: err
           });
         }
         if (!monitoringImage) {
           const LOGMESSAGE = DATETIME + "|No such monitoringImage:"+id;
           log.write("ERROR", LOGMESSAGE);
           return res.status(404).json({
             success:false,
             msg: "No such monitoringImage:"+id
           });
         }
         const LOGMESSAGE = DATETIME + "|monitoringImage Found";
         log.write("INFO", LOGMESSAGE);
         return res.json({success:true,data:monitoringImage});
         // return res.json(monitoringImage);
       });       
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }

  },
  showByMonitoringtId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringImageModel.findOne({ monitoring: id }, function (err, monitoringImage) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting monitoringImage.",
            error: err
          });
        }
        if (!monitoringImage) {
          const LOGMESSAGE = DATETIME + "|NO Such monitoringImage of project:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such monitoringImage"
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoringImage found of project:"+id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success:true,data:monitoringImage});
        // return res.json(monitoringImage);
      });     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }
 
  },

  
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var monitoringImage = new monitoringImageModel({ 
      monitoring: req.body.monitoring,
      image: req.body.image
    
            
      });
  
      monitoringImage.save(function (err, monitoringImage) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when creating monitoringImage",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|monitoringImage created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(monitoringImage);
        return res.json({success:true,msg:"monitoringImage is created",data:monitoringImage});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }

  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringImageModel.findOne({ _id: id }, function (err, monitoringImage) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when getting monitoringImage",
            error: err
          });
        }
        if (!monitoringImage) {
          const LOGMESSAGE = DATETIME + "|No such monitoringImage to update:"+id;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success:false,
            msg: "No such monitoringImage"
          });
        }
        upload(req, res, (error) => {
          console.log(req.file)
          console.log(req.body)
          if (error) {
            const LOGMESSAGE = DATETIME + "| Error while uploading picture| " + error;
            log.write("ERROR", LOGMESSAGE, 'error');
            res.json({
              success: false,
              msg: 'Failed to update picture ',
              error: error
            });
            return;
          } else {
            if (req.file == undefined) {
    
              const LOGMESSAGE = DATETIME + "| File is undefined | ";
              log.write("ERROR", LOGMESSAGE, 'error');
              res.json({
                success: false,
                msg: 'Failed to update picture',
                error: err
              });
              return;
    
            }
    
            else {
    
              /**
               * Create new record in mongoDB
               */
              var fullPath = req.protocol + '://' + req.get('Host') + '/files/' + req.file.filename;
              var getImg =   monitoringImage.image.split('/');
              console.log(getImg)
                fs.unlink('public/files/'+getImg[getImg.length-1], function (err) {
                  if (err) throw err;
                  // if no error, file has been deleted successfully
                  console.log('File deleted!');
                  monitoringImage.monitoring= req.body.monitoring?req.body.monitoring :monitoringImage.monitoring,
                  monitoringImage.image= fullPath?fullPath:monitoringImage.image 
            
                  monitoringImage.save(function (err, monitoringImage) {
                    if (err) {
                      const LOGMESSAGE = DATETIME + "|" + err.message;
                      log.write("ERROR", LOGMESSAGE);
                      return res.status(500).json({
                        success:false,
                        msg: "Error when updating monitoringImage.",
                        error: err
                      });
                    }
                    const LOGMESSAGE = DATETIME + "|Updated monitoringImage:"+id;
                    log.write("INFO", LOGMESSAGE);
                    return res.json({success:true,msg:"monitoringImage is updated",data:monitoringImage});
                    // return res.json(monitoringImage);
                  });
                  // const LOGMESSAGE = DATETIME + "|removed monitoringImage:" + id;
                  // log.write("INFO", LOGMESSAGE);
                  // return res.json({success:true,msg:"monitoringImage is deleted"});
              }); 
  
            }
          }
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }
 
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      monitoringImageModel.findByIdAndRemove(id, function (err, monitoringImage) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success:false,
            msg: "Error when deleting the monitoringImage.",
            error: err
          });
        }
        console.log('----img')
        console.log(monitoringImage)
        if (!monitoringImage) {
          const LOGMESSAGE = DATETIME + "|monitoringImage not found to delete|" +monitoringImage;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Id not found to delete"
          });
        }
        if(monitoringImage){
        var getImg =   monitoringImage.image.split('/');
        console.log('public/files/'+getImg[getImg.length-1])
          fs.unlink('public/files/'+getImg[getImg.length-1], function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
            const LOGMESSAGE = DATETIME + "|removed monitoringImage:" + id;
            log.write("INFO", LOGMESSAGE);
            return res.json({success:true,msg:"monitoringImage is deleted"});
        }); 
        
        }
   
        // return res.status(204).json();
      }); 
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success:false,
        msg: "Error when getting monitoringImage.",
        error: error
      });
    }
  },

  imageUpload: function (req, res) {
    try {
      
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      upload(req, res, (error) => {
        console.log(req.file)
        console.log(req.body)
        if (error) {
          const LOGMESSAGE = DATETIME + "| Error while uploading picture| " + error;
          log.write("ERROR", LOGMESSAGE, 'error');
          res.json({
            success: false,
            msg: 'Failed to save picture ',
            error: error
          });
          return;
        } else {
          if (req.file == undefined) {
  
            const LOGMESSAGE = DATETIME + "| File is undefined | ";
            log.write("ERROR", LOGMESSAGE, 'error');
            res.json({
              success: false,
              msg: 'Picture is required',
            });
            return;
  
          }
  
          else {
  
            /**
             * Create new record in mongoDB
             */
            var fullPath = req.protocol + '://' + req.get('Host') + '/files/' + req.file.filename;
  
            var imageUser = {
              picture: fullPath
            };
            var monitoringImage = new monitoringImageModel({



 
              monitoring: req.body.monitoring,
              image: fullPath
            
                    
              });
          
              monitoringImage.save(function (err, monitoringImage) {
                if (err) {
                  const LOGMESSAGE = DATETIME + "|" + err.message;
                  log.write("ERROR", LOGMESSAGE);
                  return res.status(500).json({
                    success:false,
                    msg: "Error when creating monitoringImage",
                    error: err
                  });
                }
                const LOGMESSAGE = DATETIME + "|monitoringImage created";
                log.write("INFO", LOGMESSAGE);
                // return res.status(201).json(monitoringImage);
                return res.json({success:true,msg:"monitoringImage is created",data:monitoringImage});
              });

          }
        }
      });
     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success: false,
          msg: "Error in therapist.",
          error: error,
        });
    }
     },
};
