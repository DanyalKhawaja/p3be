const dateFormat = require("dateformat");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;
const resourceModel = require("../models/resourceModel");
const taskPlannedResourceModel = require("../models/taskPlannedResourceModel");
const log = require("../lib/logger");
const { lte } = require("lodash");

module.exports = {
  list: function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      resourceModel.find(function (err, resource) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
        }
        const LOGMESSAGE = DATETIME + "|Resource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      }).sort({ $natural: -1 }).populate("resourceType", "name");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
  showAvailableByResourceType1: function (req, res) {
    try {
      //const ObjectId = mongoose.Types.ObjectId;
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.typeId;
      var startDate = req.params.startDate;
      var endDate = req.params.endDate;
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

      }
        , {
          _id: 0,
          resource: 1
        }
      ).exec(function (err, engagedResources) {
        var rs = new Array();

        // for (var i = 0; i < engagedResources.length; i++) {
        //   rs.push(engagedResources[i]._doc.resource);
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
                        $nin: engagedResources.map(er => er._doc.resource)
                      }
                    }, {
                      isActive: {
                        $eq: true
                      }
                    }
                  ]
                }
              ]

            }]
        }, function (err, availableResources) {
          const LOGMESSAGE = DATETIME + "| resource found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: availableResources });
        }).sort("resourceName");
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  },
  showAvailableByResourceType2: function (req, res) {
    try {
      //const ObjectId = mongoose.Types.ObjectId;
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.typeId;
      var startDate = req.params.startDate;
      var endDate = req.params.endDate;
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

      }
        , {
          _id: 0,
          resource: 1
        }
      ).exec(function (err, engagedResources) {
        var rs = new Array();

        // for (var i = 0; i < engagedResources.length; i++) {
        //   rs.push(engagedResources[i]._doc.resource);
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
                        $nin: engagedResources.map(er => er._doc.resource)
                      }
                    }, {
                      isActive: {
                        $eq: true
                      }
                    }
                  ]
                }
              ]

            }]
        }, function (err, availableResources) {
          const LOGMESSAGE = DATETIME + "| resource found";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, data: availableResources });
        }).sort("resourceName");
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  },
  showAvailableByResourceType: function (req, res) {
    try {
      //const ObjectId = mongoose.Types.ObjectId;
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var id = req.params.typeId;
      var startDate = new Date(req.params.startDate);
      var endDate = new Date(req.params.endDate);
      var wbsId = req.params.wbsId;
      var projectId = req.params.projectId;
      var idds = taskPlannedResourceModel.aggregate([{
        $match: {
          $and: [
            {
              resourceType: ObjectId(id)
            }, {
              project: {
                $ne: ObjectId(projectId)
              }
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
                        $gte: endDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    {
                      plannedStartDate: {
                        $gte: startDate
                      }
                    }, {
                      plannedEndDate: {
                        $lte: endDate
                      }
                    }
                  ]
                }
                
                , {
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

        }
      }, { $group: { _id: "$resource", engagement: { $sum: "$allocation" } } }],
        function (err, engagedResources) {

          var rsMap = {};
          for (let eRes of engagedResources) {
            if(rsMap[eRes._id]) {
              rsMap[eRes._id] += eRes.engagement;
            } else {
              rsMap[eRes._id] = eRes.engagement;
            }
          }
          resourceModel.find({
            $and: [
              {
                resourceType: ObjectId(id)
              }, {
                $or: [
                  {
                    external: true
                  }, {
                    isActive: {
                      $eq: true
                    }
                  }
                ]
              }
            ]

          }, {
            resourceType: 1,
            resourceCode: 1,
            resourceName: 1,
            resourceUnit: 1,
            rate: 1,
            currency: 1,
            isActive: 1
            // engaged: { $cond: { if: { $in: ["$_id", rs] }, then: true, else: false } }
          }

            , function (err, availableResources) {
              const LOGMESSAGE = DATETIME + "| resource found";
              log.write("INFO", LOGMESSAGE);
              console.table(rsMap)
              availableResources.forEach((el,i) => availableResources[i].allocated = rsMap[el._id]);
              console.table(availableResources)
              return res.json({ success: true, data: availableResources });
            }).sort("resourceName").lean();
        });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  },
  showResourceAllocations: async function (req, res) {
    try {
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var projectId = req.params.projectId;
      var resources = await taskPlannedResourceModel.find({project:ObjectId(projectId) }).populate('task','description').populate('resource','resourceName').populate('resourceType','name').lean();
      let promises = [];
      resources.forEach((doc,i) => {
        let promise = taskPlannedResourceModel.aggregate([{
          $match: {
            $and: [
              {
                resource: ObjectId(doc.resource._id)
              }, {
                $or: [
                  {
                    $and: [
                      {
                        plannedStartDate: {
                          $lt: doc.plannedStartDate
                        }
                      }, {
                        plannedEndDate: {
                          $gt: doc.plannedEndDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      {
                        plannedStartDate: {
                          $gte:  doc.plannedStartDate
                        }
                      }, {
                        plannedEndDate: {
                          $lte: doc.plannedEndDate
                        }
                      }
                    ]
                  }
                  , {
                    $or: [
                      {
                        $and: [
                          {
                            plannedStartDate: {
                              $lte:  doc.plannedStartDate
                            }
                          }, {
                            plannedEndDate: {
                              $gte:  doc.plannedStartDate
                            }
                          }
                        ]
                      }, {
                        $and: [
                          {
                            plannedStartDate: {
                              $lte: doc.plannedEndDate
                            }
                          }, {
                            plannedEndDate: {
                              $gte: doc.plannedEndDate
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]}
        }, { $group: { _id: "$resource", engagement: { $sum: "$allocation" } } }]
            ).exec().then(function (engagedResources) {
              resources[i].totalAllocated = engagedResources[0].engagement;
          });
          promises.push(promise);
      })

      Promise.all(promises).then(() => {
        return res.json(resources);
      } )

     
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  },
  showResourceSchedule: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var id = req.params.resourceId;
      var startDate = new Date(req.params.startDate);
      var endDate = new Date(req.params.endDate);
      console.log(startDate,endDate)
      taskPlannedResourceModel.find({
          $and: [
            {
              resource: ObjectId(id)
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
                },
                {
                  $and: [
                    {
                      plannedStartDate: {
                        $gte: startDate
                      }
                    }, {
                      plannedEndDate: {
                        $lte: endDate
                      }
                    }
                  ]
                }
                , {
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
          ]},
        function (err, schedule) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
          }
          return res.status(200).json({ success: true, data: schedule });
        }).populate('task','description').populate('resourceType','name').populate('resource','resourceName').populate('project','name').sort({plannedStartDate: 1});
    } catch (err) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  },
  showResourceTypeSchedule: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    try {
      var resourceTypeId = req.params.resourceTypeId;
      var projectId = req.params.projectId;
      taskPlannedResourceModel.find({
          $and: [
            {
              project: ObjectId(projectId)
            },  {
              resourceType: ObjectId(resourceTypeId)
            }
          ]},
        function (err, schedule) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
          }
          return res.status(200).json({ success: true, data: schedule });
        }).populate('task','description').populate('resource','resourceName').populate('resourceType','name').populate('project','name').sort({plannedStartDate: 1});
    } catch (err) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
        }
        const LOGMESSAGE = DATETIME + "|Resource List found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      }).populate("resourceType", "name");
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({ success: false, msg: "No such resource" });
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such resource found";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({ success: false, msg: "No such resource " });
        }
        const LOGMESSAGE = DATETIME + "| resource found";
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, data: resource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when creating Resource", error: err });
        }
        const LOGMESSAGE = DATETIME + "|Resource created";
        log.write("INFO", LOGMESSAGE);
        // return res.status(201).json(Resource Type);
        return res.json({ success: true, msg: "Resource is created", data: resource });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when getting Resource ", error: err });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|No such Resource  to update";
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({ success: false, msg: "No such Resource " });
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
            return res.status(500).json({ success: false, msg: "Error when updating Resource .", error: err });
          }
          const LOGMESSAGE = DATETIME + "|Saved Resource ";
          log.write("INFO", LOGMESSAGE);
          return res.json({ success: true, msg: "Resource  is updated", data: resource });
          // return res.json(Resource Type);
        });
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
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
          return res.status(500).json({ success: false, msg: "Error when deleting the Resource.", error: err });
        }
        if (!resource) {
          const LOGMESSAGE = DATETIME + "|resource not found to delete|" + resource;
          log.write("ERROR", LOGMESSAGE);
          return res.status(404).json({ success: false, msg: "Id not found to delete" });
        }
        const LOGMESSAGE = DATETIME + "|removed Resource:" + id;
        log.write("INFO", LOGMESSAGE);
        return res.json({ success: true, msg: "Resource is deleted" });
        // return res.status(204).json();
      });
    } catch (error) {
      const LOGMESSAGE = DATETIME + "|" + err.message;
      log.write("ERROR", LOGMESSAGE);
      return res.status(500).json({ success: false, msg: "Error when getting resource.", error: err });
    }
  }
};
