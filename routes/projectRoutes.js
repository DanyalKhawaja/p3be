const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const projectValidator = require("../validators/projectValidator");


/*
 * GET
 */
router.get("/", projectController.list);
router.post("/locked",  projectController.locked);
/*
 * GET project By project ID
 */
router.get("/:id", projectValidator.projectId, projectController.show);

/*
 * POST
 */
router.post("/component",  projectController.createComponent);
router.post("/", projectValidator.create, projectController.create);
/*
 * PUT
 */
router.put("/component/:id",  projectController.updateComponent);
router.put("/:id",  projectController.update);
router.put("/fromProgram/:id",  projectController.updatefromProgram);
/*
 * DELETE
 */
router.delete("/:id", projectValidator.projectId,projectController.remove);

/*
 * GET project By program ID
 */
router.get("/byComponent/:id", projectController.showByComponentId);
/*
 * GET project By portfolio ID
 */
router.get("/byPortfolio/:id", projectController.showByPortfolioId);
/*
 * GET project loation By program ID
 */
router.get("/location/:id", projectController.showLocationById);


module.exports = router;
