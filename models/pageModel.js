var { Schema, model } = require("mongoose");

var pageSchema = new Schema({
  description: {
    type: String, required: true
  },
  route: {
    type: String
  },
  path: {
    type: String, required: true
  },
  order: {
    type: Number
  },
  roles: {
    type: [],
    required: true,
    ref: "Role"
  },
  disabled: {
    type: Boolean
  },
  icon: {
    type: String
  }
});

module.exports = model("Page", pageSchema);
