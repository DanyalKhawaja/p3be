var mongoose = require("mongoose");
var schema = mongoose.Schema;

var CounterSchema = schema({

  _id: {type: String, required: true},

  seq: { type: Number, default: 0 }

});

var counter = mongoose.model('counter', CounterSchema);

var c  = new counter({_id:'trp',seq:0})

var taskPlannedResourcekSchema = new schema(
  {
    _id:{ type:Number},
    project: { 
        type: mongoose.Schema.ObjectId, ref: 'Project', required: true
    },
    task: { 
     //   type: Number, ref: 'Task', required: true
        type: mongoose.Schema.ObjectId, ref: 'Task', required: true
    },
    resource: { 
        type: mongoose.Schema.ObjectId, ref: 'Resource', required: true
    },
    quantity: { type: Number, required:true },
    resourceCostPerUnit: { type: Number, required: true }
  }
);

taskPlannedResourcekSchema.pre('save', function(next) {

  var doc = this;
  counter.findByIdAndUpdate({_id: 'trp'}, {$inc: { seq: 1} }, function(error, counter)   {

      if(error)

        return next(error);

      doc._id = counter.seq;

      next();

  });

});

module.exports = mongoose.model("TaskPlannedResource", taskPlannedResourcekSchema)
