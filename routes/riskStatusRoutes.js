const express = require("express");
const router = express.Router();

const riskStatusController = require("../controllers/riskStatusController");
const riskStatusValidator = require("../validators/riskStatusValidator");


/*
 * GET
 */
router.get("/", riskStatusController.list);

/*
 * GET User By ID
 */
// router.get("/:userId", riskStatusValidator.userId,riskStatusController.showByUserId);

/*
 * GET Username By ID
 */
// router.get("/users/:id", riskStatusValidator.riskStatusId, riskStatusController.showUsersByriskStatusId);



/*
 * POST
 */
router.post("/", riskStatusValidator.create, riskStatusController.create);

/*
 * PUT
 */
router.put("/:id", riskStatusValidator.riskStatusId, riskStatusController.update);

/*
 * DELETE
 */
router.delete("/:id", riskStatusValidator.riskStatusId, riskStatusController.remove);


module.exports = router;
