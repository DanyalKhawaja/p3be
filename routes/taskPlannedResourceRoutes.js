const express = require("express");
const passport = require('passport');

const router = express.Router();
const taskPlannedResourceController = require("../controllers/taskPlannedResourceController");

/*
 * GET
 */
router.get("/", taskPlannedResourceController.list);

/*
 * GET User By ID
 */
router.get("/:id", taskPlannedResourceController.show);

/*
 * PUT
 */
router.post("/", taskPlannedResourceController.create);

/*
 * PUT
 */
router.put("/", taskPlannedResourceController.update);
router.put("/updateStatus", taskPlannedResourceController.updateStatus);

/*
 * DELETE
 */
router.delete("/:id", taskPlannedResourceController.remove);

/*
 * GET Username By ID
 */
router.get("/byTaskIdAndProjectId/:taskId/:projectId", taskPlannedResourceController.showByTaskIdProjectId);
router.get("/byProject/:projectId", taskPlannedResourceController.showByProjectId);
router.get("/byProject2/:projectId", taskPlannedResourceController.showByProjectId2);
router.get("/byProject3/:projectId", taskPlannedResourceController.showByProjectId3);
/*
 * GET First Name By ID
 */
router.get("/taskCost/:taskId/:projectId", taskPlannedResourceController.showTaskCost);




module.exports = router;
