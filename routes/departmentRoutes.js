const express = require("express");

const router = express.Router();


const departmentController = require("../controllers/departmentController");
const departmentValidator = require("../validators/departmentValidator")

/*
 * GET
 */
router.get("/", departmentController.list);

/*
 * GET Department By User ID
 */
router.get("/:userId", departmentValidator.userId ,departmentController.showByUserId);

/*
 * GET Users By Department ID
//  */
router.get("/users/:id", departmentValidator.deptId, departmentController.showUsersByDeptId);

/*
 * POST
 */
router.post("/", departmentValidator.create,departmentController.create);

/*
 * PUT
 */
router.put("/:id",departmentValidator.deptId, departmentController.update);

/*
 * DELETE
 */
router.delete("/:id",departmentValidator.deptId, departmentController.remove);


module.exports = router;
