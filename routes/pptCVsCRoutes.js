const express = require("express");
const router = express.Router();

const pptCVsCController = require("../controllers/pptCVsCController");


/*
 * GET PPT By Portfolio ID & PPT ID
 */
 router.get("/:pptId", pptCVsCController.byPptId);

/*
 * GET PPT By Portfolio ID & PPT ID
 */
router.get("/enabled/:pptId", pptCVsCController.byPptIdEnabled);
/*
 * POST
 */
router.post("/", pptCVsCController.create);

/*
 * PUT
 */
router.put("/:id",  pptCVsCController.update);

/*
 * DELETE
 */
router.delete("/:id", pptCVsCController.remove);


module.exports = router;