const express = require("express");
const router = express.Router();

const projectTypeController = require("../controllers/projectTypeController");



/*
 * GET
 */
router.get("/", projectTypeController.list);

/*

/*
 * POST
 */
router.post("/", projectTypeController.create);

/*
 * PUT
 */
router.put("/:id",  projectTypeController.update);

/*
 * DELETE
 */
router.delete("/:id", projectTypeController.remove);


module.exports = router;
