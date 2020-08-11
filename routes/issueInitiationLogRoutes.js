const express = require("express");
const router = express.Router();

const issueInitiationLogController = require("../controllers/issueInitiationLogController");



/*
 * GET
 */
router.get("/initiation/", issueInitiationLogController.list);

/*
 * GET by project ID
 */
router.get("/byProject/:id", issueInitiationLogController.listByProjectId);

/*
 * GET by project ID
 */
router.get("/byIssue/:id", issueInitiationLogController.listByIssueId);

/*

/*
 * POST
 */
router.post("/initiation/", issueInitiationLogController.create);

/*
 * PUT
 */
router.put("/initiation/:id", issueInitiationLogController.update);

/*
 * DELETE
 */
router.delete("/initiation/:id", issueInitiationLogController.remove);


module.exports = router;
