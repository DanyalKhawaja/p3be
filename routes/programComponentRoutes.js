const express = require("express");
const router = express.Router();

const programComponentController = require("../controllers/programComponentController");


/*
 * GET
 */
router.get("/all", programComponentController.list);

/*
 * GET programComponent By programComponent ID
 */
router.get("/:id",  programComponentController.show);

/*
 * POST
 */
router.post("/", programComponentController.create);

/*
 * PUT
 */
router.put("/:id", programComponentController.update);

/*
 * DELETE
 */
router.delete("/:id", programComponentController.remove);


module.exports = router;
