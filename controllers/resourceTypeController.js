const dateFormat = require("dateformat");

const resourceTypeModel = require("../models/resourceTypeModel");
const log = require('../lib/logger');

module.exports = {
  
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceTypeModel.find(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting resourceType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resourceType });
      }).populate("parentId", "name").sort('name');
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },

  LeafResourceTypes: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceTypeModel.find({'child': []},function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting resourceType.",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource Type List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resourceType });
      }).populate("parentId", "name");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }
  },

  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var resourceType = new resourceTypeModel({
        name: req.body.name,
        isActive: req.body.isActive,
        description: req.body.description,
        parentId: req.body.parentId,
        level: req.body.level,
        path: req.body.path,
        child: [],
        unit: req.body.unit,
        currency: req.body.currency,
        singleItem : req.body.singleItem,        
        rate: req.body.rate,
        createdBy: req.body.createdBy,
        createdDate: DATETIME,
        updatedBy: req.body.updatedBy,
        updatedDate: DATETIME       
      });


      resourceType.save(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when creating Resource Type",
            error: err
          });
        }
        const LOGMESSAGE = DATETIME + "|Resource Type created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Resource Type);

        addChild(resourceType._id, resourceType.parentId, req.body.createdBy);
        
        return res.json({ success: true, msg: "Resource Type is created", data: resourceType });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },


  update: function (req, res) {
    try {
      var updateParent = false;
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceTypeModel.findOne({ _id: id }, function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting Resource Type",
            error: err
          });
        }
        if (!resourceType) {
          const LOGMESSAGE = DATETIME + "|No such Resource Type to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "No such Resource Type"
          });
        }

        var oldParentId;
        resourceType.description = req.body.description ? req.body.description : resourceType.description;
        resourceType.name= req.body.name;
        if (resourceType.parentId != req.body.parentId)
        {
          oldParentId = resourceType.parentId;
          resourceType.parentId = req.body.parentId;
          updateParent = true;
        }
        resourceType.level = req.body.level;
        resourceType.unit= req.body.unit;
        resourceType.currency = req.body.currency;
        resourceType.rate = req.body.rate;
        resourceType.path= req.body.path,
        resourceType.singleItem = req.body.singleItem;
        resourceType.updatedBy= req.body.updatedBy,
        resourceType.updatedDate = DATETIME;        


        resourceType.save(function (err, projeectType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({
              success: false,
              msg: "Error when updating Resource Type.",
              error: err
            });
          }
          const LOGMESSAGE = DATETIME + "|Saved Resource Type";
          log.write("INFO", LOGMESSAGE);
          if (updateParent)
          {
            removeChild(id, oldParentId );
            addChild(id, resourceType.parentId);
          }
          return res.json({ success: true, msg: "Resource Type is updated", data: resourceType });
          // return res.json(Resource Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceTypeModel.findByIdAndRemove(id, function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when deleting the Resource Type.",
            error: err
          });
        }
        if (!resourceType) {
          const LOGMESSAGE = DATETIME + "|" + resourceType;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({
            success: false,
            msg: "Reource type not found to delete"
          });
        }
        console.log(resourceType)
        const LOGMESSAGE = DATETIME + "|removed Resource Type:" + id;
        log.write("INFO", LOGMESSAGE);
        removeChild(resourceType._id, resourceType.parentId);
        return res.json({ success: true, msg: "Resource Type is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + error.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({
        success: false,
        msg: "Error when getting resourceType.",
        error: error
      });
    }

  }
};

function addChild (childId, parentId, updatedBy) {
  try {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = parentId;
    resourceTypeModel.findOne({ _id: id }, function (err, resourceType) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success: false,
          msg: "Error when getting Resource Type",
          error: err
        });
      }
      if (!resourceType) {
        const LOGMESSAGE = DATETIME + "|No such Resource Type to update";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success: false,
          msg: "No such Resource Type"
        });
      }
      resourceType.child.push(childId);
      resourceType.updatedBy= updatedBy,
      resourceType.updatedDate = DATETIME;        

      resourceType.save(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return false;
        }
        const LOGMESSAGE = DATETIME + "| Updated Parent with Child Resource Type";
        log.write("INFO", LOGMESSAGE);
        return true;
        // return res.json(Resource Type);
      });
    });
  } catch (error) {
    const LOGMESSAGE = DATETIME + "|" + error.message;
    log.write("ERROR", LOGMESSAGE);
    return false;
  }

}

function removeChild (childId, parentId) {
  try {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = parentId;
    resourceTypeModel.findOne({ _id: id }, function (err, resourceType) {
      if (err) {
        const LOGMESSAGE = DATETIME + "|" + err.message;
        log.write("ERROR", LOGMESSAGE);
        return res.status(500).json({
          success: false,
          msg: "Error when getting Resource Type",
          error: err
        });
      }
      if (!resourceType) {
        const LOGMESSAGE = DATETIME + "|No such Resource Type to update";
        log.write("ERROR", LOGMESSAGE);
        return res.status(404).json({
          success: false,
          msg: "No such Resource Type"
        });
      }
      var i =  resourceType.child.indexOf(childId);
      if (i == -1)
       return true;
      resourceType.child.splice(i,1);

      //resourceType.updatedBy= updatedBy,
      resourceType.updatedDate = DATETIME;        

      resourceType.save(function (err, resourceType) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return false;
        }
        const LOGMESSAGE = DATETIME + "| Updated Parent with Child Resource Type";
        log.write("INFO", LOGMESSAGE);
        return true;
        // return res.json(Resource Type);
      });
    });
  } catch (error) {
    const LOGMESSAGE = DATETIME + "|" + error.message;
    log.write("ERROR", LOGMESSAGE);
    return false;
  }

}