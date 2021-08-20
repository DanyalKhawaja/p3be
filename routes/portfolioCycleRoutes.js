const express = require("express");
const router = express.Router();

const portfolioCycleController = require("../controllers/portfolioCycleController");



/*
 * GET
 */
router.get("/", portfolioCycleController.list);
router.get("/:id", portfolioCycleController.showByPortfolioId);
router.get("/byPortfolio/:id", portfolioCycleController.showByPortfolioId);
router.get("/programs/:portfolioId/:portfolioCycleId/:startDate/:endDate", portfolioCycleController.showPortfolioCyclePrograms);
router.get("/staticprograms/:portfolioId/:startDate/:endDate", portfolioCycleController.showPortfolioStaticPrograms);
/*
 * GET Profile By Portfolio ID
 */
 router.get("/:id", portfolioCycleController.showByPortfolioCycleId);

/*
 * POST
 */
router.post("/", portfolioCycleController.create);

/*
 * PUT
 */
router.put("/:id",  portfolioCycleController.update);

/*
 * DELETE
 */
router.delete("/:id",portfolioCycleController.remove);


module.exports = router;
