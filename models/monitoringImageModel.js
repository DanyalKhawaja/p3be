var mongoose = require("mongoose");
var schema = mongoose.Schema;

var monitoringImageSchema = new schema(
  {
    monitoring: { 
        type: mongoose.Schema.ObjectId, ref: 'Monitoring', required: true
    },
    image: { 
        type: String, required: true
    }
  
}
);
  
module.exports = mongoose.model("MonitoringImage", monitoringImageSchema);

