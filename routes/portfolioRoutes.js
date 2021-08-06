const express = require("express");
const router = express.Router();

const portfolioController = require("../controllers/portfolioController");


/*
 * GET
 */
router.get("/", portfolioController.list);
router.get("/byUser/:id", portfolioController.showByUserId);
/*
 * GET Profile By Portfolio ID
 */
 router.get("/:id",  portfolioController.showByPortfolioId);

/*
 * POST
 */
router.post("/", portfolioController.create);

/*
 * PUT
 */
router.put("/:id",  portfolioController.update);

/*
 * DELETE
 */
router.delete("/:id", portfolioController.remove);


module.exports = router;
