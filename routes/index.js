var express = require("express");
const session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  // res.render("index", { title: "Database is onneted" });
  res.send({
    title:"welcome to express",
    msg:"Mongodb is connected"  })
});

module.exports = router;
