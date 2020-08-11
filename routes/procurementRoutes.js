const express = require("express");
const router = express.Router();

const procurementController = require("../controllers/procurementController");
const procurementValidator = require("../validators/procurementValidator");

/*
 * GET
 */
router.get("/", procurementController.list);

/*
 * GET procurement By procurement ID
 */
router.get("/:id", procurementValidator.projectId, procurementController.show);

/*
 * POST
 */
router.post("/", procurementValidator.create, procurementController.create);

/*
 * PUT
 */
router.put("/:id", procurementValidator.projectId, procurementController.update);

/*
 * DELETE
 */
router.delete("/:id", procurementValidator.projectId, procurementController.remove);


module.exports = router;
