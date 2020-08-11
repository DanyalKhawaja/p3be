const express = require("express");
const router = express.Router();

const stakeholderRoleController = require("../controllers/stakeholderRoleController");
const stakeholderRoleValidator = require("../validators/stakeholderRoleValidator");


/*
 * GET
 */
router.get("/", stakeholderRoleController.list);

/*
 * GET User By ID
 */
// router.get("/:userId", stakeholderRoleValidator.userId,stakeholderRoleController.showByUserId);

/*
 * GET Username By ID
 */
// router.get("/users/:id", stakeholderRoleValidator.stakeholderRoleId, stakeholderRoleController.showUsersBystakeholderRoleId);



/*
 * POST
 */
router.post("/", stakeholderRoleValidator.create, stakeholderRoleController.create);

/*
 * PUT
 */
router.put("/:id", stakeholderRoleValidator.stakeholderRoleId, stakeholderRoleController.update);

/*
 * DELETE
 */
router.delete("/:id", stakeholderRoleValidator.stakeholderRoleId, stakeholderRoleController.remove);


module.exports = router;
