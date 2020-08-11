var mongoose = require("mongoose");
var schema = mongoose.Schema;

var lessonLearnedSchema = new schema(
  {

    project: { type: mongoose.Schema.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    lessonLearnedType: { type: mongoose.Schema.ObjectId, ref: 'LessonLearnedType', required: true },
    priority: { type: Number, required: true, min: 1, max: 2 },
    description: { type: String, required: true },
    recommendation: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    author: { type: String, required: true }

  }
);

// TaskSchema.index({taskId: 1, project: 1}, { unique: true });
module.exports = mongoose.model("LessonLearned", lessonLearnedSchema);

