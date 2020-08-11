const express = require("express");
const router = express.Router();

const resourceTypeController = require("../controllers/resourceTypeController");



/*
 * GET
 */
router.get("/", resourceTypeController.list);

/*

/*
 * POST
 */
router.post("/", resourceTypeController.create);

/*
 * PUT
 */
router.put("/:id", resourceTypeController.update);

/*
 * DELETE
 */
router.delete("/:id", resourceTypeController.remove);


module.exports = router;
