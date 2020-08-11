const express = require("express");
const router = express.Router();

const lessonLearnedController = require("../controllers/lessonLearnedController");


/*
 * GET
 */
router.get("/", lessonLearnedController.list);

/*
 * GET lessonLearned By by Porject ID
 */
router.get("/:id",  lessonLearnedController.show);

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
