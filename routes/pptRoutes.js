const express = require("express");
const router = express.Router();

const pptController = require("../controllers/pptController");


/*
 * GET PPT By Portfolio ID & PPT ID
 */
 router.get("/byPortfolioPptId/:portfolioId/:pptId", pptController.byPortfolioPptId);

 /*
 * GET PPT By Portfolio ID
 */
router.get("/byPortfolioId/:portfolioId", pptController.byPortfolioId);
/*
 * POST
 */
router.post("/", pptController.create);

/*
 * PUT
 */
router.put("/:id",  pptController.update);

/*
 * DELETE
 */
router.delete("/:id", pptController.remove);


module.exports = router;