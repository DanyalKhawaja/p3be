const express = require("express");
const router = express.Router();

const programController = require("../controllers/programController");
const programValidator = require("../validators/programValidator");


/*
 * GET
 */
router.get("/", programController.list);
// router.get("/locked", programController.lockedList);
// router.get("/open", programController.openList);
/*
 * GET Program By Program ID
 */
router.get("/:id", programValidator.programId, programController.show);

/*
 * POST
 */
router.post("/", programValidator.create, programController.create);

/*
 * PUT
 */
router.put("/:id", programValidator.programId, programController.update);
// router.put("/lock/:id", programValidator.programId, programController.lock);

/*
 * DELETE
 */
router.delete("/:id", programValidator.programId,programController.remove);

/*
 * GET program By profile ID
 */
router.get("/byPortfolio/:id", programValidator.portfolioId, programController.showByPortfolioId);


module.exports = router;
