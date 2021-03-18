const express = require("express");
const router = express.Router();

const pptOVsOController = require("../controllers/pptOVsOController");


/*
 * GET PPT By Portfolio ID & PPT ID
 */
 router.get("/:pptId", pptOVsOController.byPptId);

 
/*
 * POST
 */
router.post("/", pptOVsOController.create);

/*
 * PUT
 */
router.put("/:id",  pptOVsOController.update);

/*
 * DELETE
 */
router.delete("/:id", pptOVsOController.remove);


module.exports = router;