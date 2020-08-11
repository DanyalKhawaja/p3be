const express = require("express");
const router = express.Router();

const lessonLearnedTypeController = require("../controllers/lessonLearnedTypeController");


/*
 * GET
 */
router.get("/", lessonLearnedTypeController.list);

/*
 * GET lessonLearnedType By lessonLearnedType ID
 */
router.get("/:id",  lessonLearnedTypeController.show);

/*
 * POST
 */
router.post("/", lessonLearnedTypeController.create);

/*
 * PUT
 */
router.put("/:id", lessonLearnedTypeController.update);

/*
 * DELETE
 */
router.delete("/:id", lessonLearnedTypeController.remove);


module.exports = router;
