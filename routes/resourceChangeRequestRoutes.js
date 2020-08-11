const express = require("express");
const router = express.Router();

const resourceChangeRequestController = require("../controllers/resourceChangeRequestController");


/*
 * GET by CRID
 */
router.get("/:id", resourceChangeRequestController.list);

/*
 * GET resourceChangeRequest By resourceChangeRequest ID
 */
// router.get("/:id",  resourceChangeRequestController.show);

/*
 * POST
 */
router.post("/",  resourceChangeRequestController.create);

/*
 * PUT
 */
router.put("/:id",  resourceChangeRequestController.update);

/*
 * DELETE
 */
router.delete("/:id", resourceChangeRequestController.remove);


module.exports = router;
