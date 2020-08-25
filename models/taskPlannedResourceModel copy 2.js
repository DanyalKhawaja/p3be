var mongoose = require("mongoose");
var schema = mongoose.Schema;

// var CounterSchema = schema({

//   _id: { type: String, required: true },
//   _id: { type: String, required: true },

//   seq: { type: Number, default: 0 }

// });

// var counter = mongoose.model('counter', CounterSchema);

// var c = new counter({ _id: 'trp', seq: 0 })

var taskPlannedResourceSchema = new schema({
  project: {  type: mongoose.Schema.ObjectId, ref: 'Project',  required: true},
  wp: { type: String, required: true },
  resource: { type: mongoose.Schema.ObjectId, ref: 'Resource', required: true },
  item: { type: String },
  itemType:  { type: String },
  resourceType: { type: mongoose.Schema.ObjectId, ref: 'ResourceType'},
  quantity: { type: Number, required: true },
  resourceCostPerUnit: { type: Number, required: true },
  plannedStartDate: { type: Date, required: true },
  plannedEndDate: { type: Date, required: true },
  projectLocation: { type: mongoose.Schema.ObjectId, ref: 'ProjectLocation', required: true },
  UOM: { type: String },
  total: { type: Number, required: true }
});

// taskPlannedResourcekSchema.pre('save', function (next) {

//   var doc = this;
//   counter.findByIdAndUpdate({ _id: 'trp' }, { $inc: { seq: 1 } }, function (error, counter) {

//     if (error)

//       return next(error);

//     doc._id = counter.seq;

//     next();

//   });

// });

module.exports = mongoose.model("TaskPlannedResource", taskPlannedResourceSchema)
