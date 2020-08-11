const express = require("express");
const router = express.Router();

const issueResolutionLogController = require("../controllers/issueResolutionLogController");



/*
 * GET
 */
router.get("/resolution/", issueResolutionLogController.list);

/*

/*
 * POST
 */
router.post("/resolution/", issueResolutionLogController.create);

/*
 * PUT
 */
router.put("/resolution/:id", issueResolutionLogController.update);

/*
 * DELETE
 */
router.delete("/resolution/:id", issueResolutionLogController.remove);


module.exports = router;
