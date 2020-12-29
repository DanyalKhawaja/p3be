const mongoose = require("mongoose");
const schema = mongoose.Schema;

const currencySchema = new schema({
   _id: {
      type: String
  
   },
   name: {
      type: String,
      unique: true,
      required: true
   }
});

module.exports = mongoose.model("Currency", currencySchema);
