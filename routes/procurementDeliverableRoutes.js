const express = require("express");
const router = express.Router();

const procurementDeliverableController = require("../controllers/procurementDeliverableController");


/*
 * GET
 */
router.get("/all", procurementDeliverableController.list);

/*
 * GET procurementDeliverable By procurementDeliverable ID
 */
router.get("/:id",  procurementDeliverableController.show);

/*
 * POST
 */
router.post("/", procurementDeliverableController.create);

/*
 * PUT
 */
router.put("/:id", procurementDeliverableController.update);

/*
 * DELETE
 */
router.delete("/:id", procurementDeliverableController.remove);


module.exports = router;
