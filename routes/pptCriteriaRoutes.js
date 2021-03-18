const express = require("express");
const router = express.Router();

const pptCriteriaController = require("../controllers/pptCriteriaController");

router.get("/", pptCriteriaController.get);
 /*
 * GET PPT By PPT ID
 */
router.get("/:pptId", pptCriteriaController.byPptId);
/*
 * POST
 */
router.post("/", pptCriteriaController.create);

/*
 * PUT
 */
router.put("/:id",  pptCriteriaController.update);

/*
 * DELETE
 */
router.delete("/:id", pptCriteriaController.remove);


module.exports = router;