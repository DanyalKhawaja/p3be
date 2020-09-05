const dateFormat = require("dateformat");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const resourceModel = require("../models/resourceModel");
const taskPlannedResourceModel = require("../models/taskPlannedResourceModel");
const log = require("../lib/logger");

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceModel.find(function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
        }
        const LOGMESSAGE = DATETIME + "|Resource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success: true, data: resource});
      }).populate("resourceType", "name");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },

  /*
showAvailableByResourceType: function (req, res) {
  try {
    //const ObjectId = mongoose.Types.ObjectId;
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.typeId;
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var ids = taskPlannedResourceModel.find(
      { $and:
        [
          {  resource:  ObjectId(id)  },
          {
            $or:
            [
                {   $and:
                    [   { plannedStartDate: { $lt: new Date("2020-04-10T00:00:00.000Z") } },
                        { plannedEndDate : { $gt: new Date("2020-05-10T00:00:00.000Z")  } }
                    ]
                } ,
                {
                    $or:
                    [
                        {
                            $and:
                            [   { plannedStartDate: { $lte: new Date("2020-04-10T00:00:00.000Z") } },
                                { plannedEndDate : { $gte: new Date("2020-04-10T00:00:00.000Z")  } }
                            ]
                        },
                        {
                            $and:
                            [   { plannedStartDate: { $lte: new Date("2020-05-10T00:00:00.000Z") } },
                                { plannedEndDate : { $gte: new Date("2020-05-10T00:00:00.000Z")  } }
                            ]
                        }
                    ]
                }
            ]
          }
        ]
      }
      ,{ _id:0, resource : 1 }
    ).exec(function (err, engagedResources) {

      var resoruces = new Array();
      for (var i = 0; i < engagedResources.length; i++)
      {
        resoruces.push(engagedResources[i]._doc.resource);
      }
      //resourceModel.find({"_id": {"$nin": [ObjectId("4f08a75f306b428fb9d8bb2e"),  ObjectId("4f08a766306b428fb9d8bb2f")]}})`
      resourceModel.find({$and:[{"_id": {"$nin": [resoruces]}},{'isActive': {"$eq" : true}}]}
        ,function (err, resource) {
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
     }).sort('resourceName');
  });
  } catch (error) {
    const LOGMESSAGE = DATETIME + "|" + err.message;
    log.write("ERROR", LOGMESSAGE);
    return res.status(500).json({
      success:false,
      msg: "Error when getting resource.",
      error: err
    });
  }

},
*/
  showAvailableByResourceType: function (req, res) {
    try {
      //const ObjectId = mongoose.Types.ObjectId;
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.typeId;
      var startDate = new Date(req.params.startDate);
      var endDate = new Date(req.params.endDate);
      var wbsId = req.params.wbsId;
      var ids = taskPlannedResourceModel.find({
        $and: [
          {
            resourceType: ObjectId(id)
          }, {
            wp: {
              $ne: wbsId
            }
          }, {
            $or: [
              {
                $and: [
                  {
                    plannedStartDate: {
                      $lt: startDate
                    }
                  }, {
                    plannedEndDate: {
                      $gt: endDate
                    }
                  }
                ]
              }, {
                $or: [
                  {
                    $and: [
                      {
                        plannedStartDate: {
                          $lte: startDate
                        }
                      }, {
                        plannedEndDate: {
                          $gte: startDate
                        }
                      }
                    ]
                  }, {
                    $and: [
                      {
                        plannedStartDate: {
                          $lte: endDate
                        }
                      }, {
                        plannedEndDate: {
                          $gte: endDate
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }, {
        _id: 0,
        resource: 1
      }).exec(function (err, engagedResources) {
        // var engangedResources = new Array();
        // for (var i = 0; i < engagedResources.length; i++) {
        //   resoruces.push(engagedResources[i]._doc.resource);
        // }
        //resourceModel.find({"_id": {"$nin": [ObjectId("4f08a75f306b428fb9d8bb2e"),  ObjectId("4f08a766306b428fb9d8bb2f")]}})`
        resourceModel.find({
          $and: [
            {
              resourceType: ObjectId(id)
            }, {
              $or: [
                {
                  external: true
                }, {
                  $and: [
                    {
                      _id: {
                        $nin: [engagedResources.map(er => er.resource)]
                      }
                    }, {
                      isActive: {
                        $eq: true
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }, function (err, availableResources) {
          const LOGMESSAGE = DATETIME + "| resource found";
          log.write("INFO", LOGMESSAGE);
          return res.json({success: true, data: availableResources});
        }).sort("resourceName");
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },

  /*
showAvailableByResourceType: function (req, res) {
  try {
    //const ObjectId = mongoose.Types.ObjectId;
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var id = req.params.id;
 //   resourceModel.findOne({ resourceType: id }, function (err, resource) {
      //resourceModel.find({ resourceType: id }, function (err, mohsin) {
        resourceModel.aggregate([
          //{"$group": { "_id": "$author"},
          //     "totalAuthorViews" : {$sum : "$views"},
          //     "comments" : {$push : "$comments"}
          //},
          {$match: {"resourceType":ObjectId(id)}},
          {
            "$lookup": {
              "from": "taskplannedresources",
              "localField": "_id",
              "foreignField": "resource",
              "as": "enagements"
            }
          }
          ,
          {
            "$unwind": {"path": "$enagements"}
          }//,
          //{
          //  "$limit": 10
          //}
        ]).exec(function (err, mohsin) {
      const LOGMESSAGE = DATETIME + "| resource found";
      log.write("INFO", LOGMESSAGE);
      return res.json({ success: true, data: mohsin });
    });
  } catch (error) {
    const LOGMESSAGE = DATETIME + "|" + err.message;
    log.write("ERROR", LOGMESSAGE);
    return res.status(500).json({
      success:false,
      msg: "Error when getting resource.",
      error: err
    });
  }

},*/

  allActive: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceModel.find({
        isActive: true
      }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
        }
        const LOGMESSAGE = DATETIME + "|Resource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success: true, data: resource});
      }).populate("resourceType", "name");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },

  show: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findOne({
        _id: id
      }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({success: false, msg: "No such resource"});
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success: true, data: resource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },
  showByResourceTypeId: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.find({
        resourceType: id
      }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({success: false, msg: "No such resource "});
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({success: true, data: resource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },
  create: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var resource = new resourceModel({
        resourceType: req.body.resourceType,
        resourceCode: req.body.resourceCode,
        resourceName: req.body.resourceName,
        resourceUnit: req.body.resourceUnit,
        rate: req.body.resourceRate,
        currency: req.body.resourceCurrency,
        // currency: req.body.currency,
        //rate: req.body.rate,
        //calendarType: req.body.calendarType,
        isActive: req.body.isActive
      });

      resource.save(function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when creating Resource", error: err});
        }
        const LOGMESSAGE = DATETIME + "|Resource created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Resource Type);
        return res.json({success: true, msg: "Resource is created", data: resource});
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },

  update: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findOne({
        _id: id
      }, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when getting Resource ", error: err});
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such Resource  to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({success: false, msg: "No such Resource "});
        }
        resource.resourceCode = req.body.resourceCode;
        resource.resourceType = req.body.resourceType
          ? req.body.resourceType
          : resource.resourceType;
        resource.resourceName = req.body.resourceName
          ? req.body.resourceName
          : resource.resourceName;
        resource.resourceUnit = req.body.resourceUnit
          ? req.body.resourceUnit
          : resource.resourceUnit;
        resource.currency = req.body.resourceCurrency;
        resource.rate = req.body.resourceRate;
        resource.isActive = req.body.isActive;

        resource.save(function (err, projeectType) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({success: false, msg: "Error when updating Resource .", error: err});
          }
          const LOGMESSAGE = DATETIME + "|Saved Resource ";
          log.write("INFO", LOGMESSAGE);
          return res.json({success: true, msg: "Resource  is updated", data: resource});
          // return res.json(Resource Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  },

  remove: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.id;
      resourceModel.findByIdAndRemove(id, function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({success: false, msg: "Error when deleting the Resource.", error: err});
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|resource not found to delete|" + resource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({success: false, msg: "Id not found to delete"});
        }
        const LOGMESSAGE = DATETIME + "|removed Resource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({success: true, msg: "Resource is deleted"});
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({success: false, msg: "Error when getting resource.", error: err});
    }
  }
};
