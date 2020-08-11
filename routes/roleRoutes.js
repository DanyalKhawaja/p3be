const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");
const roleValidator = require("../validators/roleValidator");


/*
 * GET
 */
router.get("/", roleController.list);

/*
 * GET User By ID
 */
router.get("/:userId", roleValidator.userId,roleController.showByUserId);

/*
 * GET Username By ID
 */
router.get("/users/:id", roleValidator.roleId, roleController.showUsersByRoleId);



/*
 * POST
 */
router.post("/",roleValidator.create, roleController.create);

/*
 * PUT
 */
router.put("/:id",roleValidator.roleId, roleController.update);

/*
 * DELETE
 */
router.delete("/:id", roleValidator.roleId,roleController.remove);


module.exports = router;
