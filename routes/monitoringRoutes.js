const express = require("express");
const passport = require('passport');

const router = express.Router();
const monitoringController = require("../controllers/monitoringController");

/*
 * GET
 */
router.get("/", monitoringController.list);

router.get("/completedTask/:id", monitoringController.showCompletedTask);

router.get("/taskWithMonitoring/:id", monitoringController.showTaskWithMonitoring);
/*
 * GET User By ID
 */
// router.get("/:id/:taskId", monitoringController.show);

/*
 * PUT
 */
router.post("/", monitoringController.create);

/*
 * PUT
 */
// router.put("/:id", monitoringController.update);

/*
 * DELETE
 */
router.delete("/:id", monitoringController.remove);

/*
 * GET Username By ID
 */
router.get("/monitoringByTaskId/:id", monitoringController.showMonitoringByTaskId);

/*
 * GET Username By ID
 */
router.get("/byProjectIdAndTaskId/:id/:taskId", monitoringController.show);


/*
 * GET Username By ID
 */


/*
 * GET Username By ID
 */
router.get("/taskWithNoMonitoring/:projectId/:plannedStartDate", monitoringController.showTaskWithNoMonitoring);

/*
 * GET Username By ID
 */
router.get("/withPlannedStartDate/:projectId/:plannedStartDate", monitoringController.showTaskWithPlannedStatDate);


module.exports = router;
