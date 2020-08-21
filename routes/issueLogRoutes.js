const express = require("express");
const router = express.Router();

const issueLogController = require("../controllers/issueLogController");

/* GET */
router.get("/", issueLogController.list);

/* GET by project ID */
router.get("/byProject/:id", issueLogController.listByProjectId);

/* GET by project ID */
router.get("/latestByProject/:id", issueLogController.latestListByProjectId);

/*

/*
 * POST
 */
router.post("/", issueLogController.create);

/* PUT */
router.put("/:id", issueLogController.update);

module.exports = router;
