const express = require("express");

const router = express.Router();


const companyController = require("../controllers/companyController");


/*
 * GET
 */
router.get("/", companyController.list);

/*
 * GET company By User ID
 */
router.get("/:id", companyController.byId);


/*
 * POST
 */
router.post("/", companyController.create);

/*
 * PUT
 */
router.put("/:id", companyController.update);


module.exports = router;
