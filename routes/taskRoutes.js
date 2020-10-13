const express = require("express");
const passport = require('passport');

const router = express.Router();
const taskController = require("../controllers/taskController");

/*
 * GET
 */
router.get("/", taskController.list);

/*
 * POST
 */
router.post("/", taskController.create);

/*
 * PUT
 */
router.put("/", taskController.update);

/*
 * DELETE
 */
router.delete("/:taskId/:projectId", taskController.remove);

router.post("/wbs", taskController.wbs);


router.put("/wbs", taskController.updateWorkPackages);

/*
 * GET Task By ID
 */
router.get("/byTaskIdAndProjectId/:id/:projectId", taskController.show);

/*
 * GET Username By ID
 */
router.get("/byProject/:id", taskController.showTaskByProjectId);
router.get("/executionsPendingbyProject/:id", taskController.showExecutionsPendingByProjectId);
router.get("/wptasksByProject/:id", taskController.showWPTasksByProjectId);
router.get("/executedTasksbyProject/:id", taskController.showExecutedTasksByProjectId);


/*
 * GET First Name By ID
 */
router.get("/startDate/:id", taskController.showStartDate);

/*
 * GET Last name By ID
 */
router.get("/endDate/:id", taskController.showEndDate);
/*
 * GET Email By ID
 */
router.get("/totalPlannedCost/:projectId", taskController.showTotalPlannedCostByProjectId);
/*
 * GET All the tasks where milestones are true 
 */
router.get("/milestones/:projectId", taskController.showMilestonesByProjetId);
/*
 * GET All the tasks where workpakages are true 
 */
router.get("/workPackages/:projectId", taskController.showWorkPackagesByProjectId);


module.exports = router;
