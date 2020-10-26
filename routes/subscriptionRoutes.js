const express = require("express");

const router = express.Router();


const subscriptionController = require("../controllers/subscriptionController");


/*
 * GET
 */
router.get("/", subscriptionController.list);

/*
 * GET subscription By User ID
 */
router.get("/:id", subscriptionController.byId);

/*
 * GET subscription By User ID
 */
router.get("/byCompany/:id", subscriptionController.byCompanyId);
/*
 * POST
 */
router.post("/", subscriptionController.create);

/*
 * PUT
 */
router.put("/:id", subscriptionController.update);


module.exports = router;
