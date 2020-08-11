const express = require("express");
const passport = require('passport');

const router = express.Router();
const projectResourceController = require("../controllers/projectResourceController");

/*
 * GET
 */
router.get("/", projectResourceController.list);

/*
 * POST
 */
router.post("/", projectResourceController.create);

/*
 * PUT
 */
router.put("/:id", projectResourceController.update);

/*
 * DELETE
 */
router.delete("/:id/:projectId", projectResourceController.remove);



/*
 * GET projectResource By ID
 */
router.get("/byProjectId/:id", projectResourceController.show);



module.exports = router;
