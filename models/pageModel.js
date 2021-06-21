var { Schema, model } = require("mongoose");

var pageSchema = new Schema({
  description: {
    type: String, required: true
  },
  route: {
    type: String, required: true
  },
  path: {
    type: String, required: true
  },
  order: {
    type: Number
  },
  disabled: {
    type: Boolean
  }
});

module.exports = model("Page", pageSchema);
