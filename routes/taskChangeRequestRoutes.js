const express = require("express");
const router = express.Router();

const taskChangeRequestController = require("../controllers/taskChangeRequestController");


/*
 * GET
 */
router.get("/", taskChangeRequestController.list);

/*
 * GET taskChangeRequest By taskChangeRequest ID
 */
router.get("/:id",  taskChangeRequestController.show);

/*
 * POST
 */
router.post("/", taskChangeRequestController.create);

/*
 * PUT
 */
router.put("/:id",  taskChangeRequestController.update);

/*
 * DELETE
 */
router.delete("/:id", taskChangeRequestController.remove);
/*
 * DELETE by task
 */
router.delete("/byTask/:id", taskChangeRequestController.removeByTask);


module.exports = router;
