var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  // res.render("index", { title: "Database is onneted" });
  res.send({
    title:"welcome to express",
    msg:"Mongodb is connected"  })
});

module.exports = router;
