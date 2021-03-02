const express = require("express");
const router = express.Router();

const programBenefitMonitoringController = require("../controllers/programBenefitMonitoringController");


/*
 * GET
 */
router.get("/all", programBenefitMonitoringController.list);

/*
 * GET programBenefitMonitoring By Benefit ID
 */
router.get("/byBenefit/:id",  programBenefitMonitoringController.showByBenefit);

/*
 * GET programBenefitMonitoring By Program ID
 */
router.get("/byProgram/:id",  programBenefitMonitoringController.showByProgram);
/*
 * GET programBenefitMonitoring By  ID
 */
router.get("/:id",  programBenefitMonitoringController.show);

/*
 * POST
 */
router.post("/", programBenefitMonitoringController.create);

/*
 * PUT
 */
router.put("/:id", programBenefitMonitoringController.update);

/*
 * DELETE
 */
router.delete("/:id", programBenefitMonitoringController.remove);


module.exports = router;
