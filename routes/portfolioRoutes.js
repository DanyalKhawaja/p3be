const express = require("express");
const router = express.Router();

const portfolioController = require("../controllers/portfolioController");
const portfolioValidator = require("../validators/portfolioValidator");


/*
 * GET
 */
router.get("/", portfolioController.list);

/*
 * GET Profile By Portfolio ID
 */
 router.get("/:id", portfolioValidator.portfolioId, portfolioController.showByPortfolioId);

/*
 * POST
 */
router.post("/", portfolioController.create);

/*
 * PUT
 */
router.put("/:id", portfolioValidator.portfolioId, portfolioController.update);

/*
 * DELETE
 */
router.delete("/:id", portfolioValidator.portfolioId,portfolioController.remove);


module.exports = router;
