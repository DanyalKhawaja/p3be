const express = require("express");
const router = express.Router();

const pptOptionsController = require("../controllers/pptOptionsController");


 /*
 * GET PPT By PPT ID
 */
router.get("/:pptId", pptOptionsController.byPptId);
/*
 * POST
 */
router.post("/", pptOptionsController.create);

/*
 * PUT
 */
router.put("/:id",  pptOptionsController.update);

/*
 * DELETE
 */
router.delete("/:id", pptOptionsController.remove);


module.exports = router;