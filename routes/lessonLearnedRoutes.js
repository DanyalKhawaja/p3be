const express = require("express");
const router = express.Router();

const lessonLearnedController = require("../controllers/lessonLearnedController");


/*
 * GET
 */
router.get("/:id", lessonLearnedController.byId);

/*
 * GET lessonLearned By by Porject ID
 */
router.get("/byProject/:projectId",  lessonLearnedController.byProject);

/*
 * POST
 */
router.post("/", lessonLearnedController.create);

/*
 * PUT
 */
router.put("/:id", lessonLearnedController.update);

/*
 * DELETE
 */
router.delete("/:id", lessonLearnedController.remove);


module.exports = router;
