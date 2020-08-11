const express = require("express");
const passport = require('passport');

const router = express.Router();
const taskResourceUtilizedController = require("../controllers/taskResourceUtilizedController");

/*
 * GET
 */
router.get("/", taskResourceUtilizedController.list);

/*
 * GET TRU by task id and projet id
 */
router.get("/byProjectIdAndTaskId/:id/:taskId", taskResourceUtilizedController.show);

/*
 * PUT
 */
router.post("/", taskResourceUtilizedController.create);

/*
 * PUT
 */
router.put("/:id", taskResourceUtilizedController.update);

/*
 * DELETE
 */
router.delete("/:id/:taskId", taskResourceUtilizedController.remove);

/*
 * GET Username By ID
 */
// router.get("/taskByProjectId/:id", taskResourceUtilizedController.showTaskByProjectId);



module.exports = router;
