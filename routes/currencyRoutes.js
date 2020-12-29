const express = require("express");
const router = express.Router();

const currencyController = require("../controllers/currencyController");


/*
 * GET
 */
router.get("/", currencyController.list);

/*
 * GET User By ID
 */
router.get("/:currencyId", currencyController.showById);

router.post("/",currencyController.create);


module.exports = router;
