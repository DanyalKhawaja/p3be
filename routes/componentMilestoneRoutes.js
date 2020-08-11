const express = require("express");
const router = express.Router();

const componentMilestoneController = require("../controllers/componentMilestoneController");


/*
 * GET
 */
router.get("/all", componentMilestoneController.list);

/*
 * GET componentMilestone By componentMilestone ID
 */
router.get("/:id",  componentMilestoneController.show);

/*
 * POST
 */
router.post("/", componentMilestoneController.create);

/*
 * PUT
 */
router.put("/:id", componentMilestoneController.update);

/*
 * DELETE
 */
router.delete("/:id", componentMilestoneController.remove);


module.exports = router;
