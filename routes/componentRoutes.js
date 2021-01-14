const express = require("express");
const router = express.Router();

const componentController = require("../controllers/componentController");
const componentValidator = require("../validators/componentValidator");


/*
 * GET
 */
router.get("/", componentController.list);
router.get("/locked", componentController.lockedList);
router.get("/open", componentController.openList);
/*
 * GET Component By Component ID
 */
router.get("/:id", componentValidator.componentId, componentController.show);

/*
 * POST
 */
router.post("/", componentController.create);

/*
 * PUT
 */
router.put("/:id", componentValidator.componentId, componentController.update);
router.put("/lock/:id", componentValidator.componentId, componentController.lock);

/*
 * DELETE
 */
router.delete("/:id", componentValidator.componentId,componentController.remove);

/*
 * GET component By profile ID
 */
router.get("/byProgram/:id", componentValidator.programId, componentController.showByProgramId);


module.exports = router;
