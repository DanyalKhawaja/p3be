const express = require("express");
const router = express.Router();

const issueUpdateController = require("../controllers/issueUpdateController");



/*
 * GET
 */
router.get("/updates/", issueUpdateController.list);

/*

/*
 * POST
 */
router.post("/updates/", issueUpdateController.create);

/*
 * PUT
 */
// router.put("/updates/:id", issueUpdateController.update);

/*
 * DELETE
 */
router.delete("/updates/:id", issueUpdateController.remove);


module.exports = router;
