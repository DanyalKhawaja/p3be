const express = require("express");
const router = express.Router();

const stakeholderController = require("../controllers/stakeholderController");


/*
 * GET
 */
router.get("/all", stakeholderController.list);

/*
 * GET stakeholder By stakeholder ID
 */
router.get("/:id",  stakeholderController.show);
router.get("/byPortfolio/:id",  stakeholderController.showByPortfolio);
router.get("/byProgram/:id",  stakeholderController.showByProgram);
/*
 * POST
 */
router.post("/", stakeholderController.create);

/*
 * PUT
 */
router.put("/:id", stakeholderController.update);

/*
 * DELETE
 */
router.delete("/:id", stakeholderController.remove);


module.exports = router;
