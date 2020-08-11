const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");



/*
 * GET
 */
router.get("/", resourceController.list);

/*
 * GET Resource By ID
 */
router.get("/:id", resourceController.show);
/*
 * GET Resource By ResourceType
 */
router.get("/byResourceType/:id", resourceController.showByResourceTypeId);

/*
 * POST
 */
router.post("/", resourceController.create);

/*
 * PUT
 */
router.put("/:id", resourceController.update);

/*
 * DELETE
 */
router.delete("/:id", resourceController.remove);


module.exports = router;
