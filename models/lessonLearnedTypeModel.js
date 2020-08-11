var mongoose = require("mongoose");
var schema = mongoose.Schema;

var lessonLearnedTypeSchema = new schema(
  {
  
    description: { type: String, required: true }    
 
  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("LessonLearnedType", lessonLearnedTypeSchema);

