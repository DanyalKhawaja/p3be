const express = require("express");
const router = express.Router();

const programBenefitController = require("../controllers/programBenefitController");


/*
 * GET
 */
router.get("/all", programBenefitController.list);

/*
 * GET programBenefit By programBenefit ID
 */
router.get("/:id",  programBenefitController.show);

/*
 * POST
 */
router.post("/", programBenefitController.create);

/*
 * PUT
 */
router.put("/:id", programBenefitController.update);

/*
 * DELETE
 */
router.delete("/:id", programBenefitController.remove);


module.exports = router;
