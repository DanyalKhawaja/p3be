const express = require("express");
const router = express.Router();

const riskRegisterController = require("../controllers/riskRegisterController");


/*
 * GET
 */
router.get("/", riskRegisterController.list);

/*
 * GET riskRegister By riskRegister ID
 */
router.get("/:id",  riskRegisterController.show);

/*
 * GET riskRegister By project ID
 */
router.get("/byProject/:id",  riskRegisterController.showByProject);

router.get("/byRiskImpact/:projectId/:costImpact/:timeImpact",  riskRegisterController.showByRiskImpact);

/*
 * POSTm
 */
router.post("/", riskRegisterController.create);

/*
 * PUT
 */
router.put("/:id", riskRegisterController.update);

/*
 * DELETE
 */
router.delete("/:id", riskRegisterController.remove);

module.exports = router;
