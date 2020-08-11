const express = require("express");
const router = express.Router();

const programStakeholderController = require("../controllers/programStakeholderController");


/*
 * GET
 */
router.get("/all", programStakeholderController.list);

/*
 * GET programStakeholder By programStakeholder ID
 */
router.get("/:id",  programStakeholderController.show);

/*
 * POST
 */
router.post("/", programStakeholderController.create);

/*
 * PUT
 */
router.put("/:id", programStakeholderController.update);

/*
 * DELETE
 */
router.delete("/:id", programStakeholderController.remove);


module.exports = router;
