const express = require("express");
const passport = require('passport');

const router = express.Router();
const taskUtilizedResourceController = require("../controllers/taskUtilizedResourceController");

/*
 * GET
 */
router.get("/", taskUtilizedResourceController.list);

/*
 * GET TRU by task id and projet id
 */
router.get("/byProjectIdAndTaskId/:id/:taskId", taskUtilizedResourceController.show);
router.get("/byProject/:projectId/", taskUtilizedResourceController.showByProject);
/*
 * PUT
 */
router.post("/", taskUtilizedResourceController.create);

/*
 * PUT
 */
router.put("/:id", taskUtilizedResourceController.update);

/*
 * DELETE
 */
router.delete("/:id/:taskId", taskUtilizedResourceController.remove);

/*
 * GET Username By ID
 */
// router.get("/taskByProjectId/:id", taskUtilizedResourceController.showTaskByProjectId);



module.exports = router;
