const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const userValidator = require('../validators/userValidator')

/*
 * GET
 */
router.get("/", userController.list);

/*
 * GET User By ID
 */
router.get("/:id", userController.show);

/*
 * POST
 */
router.post("/", userController.create);

/*
 * PUT
 */
router.put("/:id",userValidator.update, userController.update);

/*
 * DELETE
 */
router.delete("/:id", userController.remove);

/*
 * GET Username By ID
 */
router.get("/username/:id", userController.showUsername);

/*
 * GET First Name By ID
 */
router.get("/firstName/:id", userController.showFirstName);

/*
 * GET Last name By ID
 */
router.get("/lastName/:id", userController.showLastName);
/*
 * GET Email By ID
 */
router.get("/email/:id", userController.showEmail);
/*
 * GET Phone No By ID
 */
router.get("/phoneNo/:id", userController.showPhoneNumber);
/*
 * GET Full Name By ID
 */
router.get("/fullName/:id", userController.showFullName);
/*
 * GET Role By ID
 */
router.get("/role/:id", userController.showRole);
/*
 * GET Role By ID
 */
router.get("/department/:id", userController.showDepartment);


module.exports = router;
