const express = require("express");
const router = express.Router();

const benefitsNatureController = require("../controllers/benefitsNatureController");
const benefitsNatureValidator = require("../validators/benefitsNatureValidator");


/*
 * GET
 */
router.get("/", benefitsNatureController.list);

/*
 * GET User By ID
 */
// router.get("/:userId", benefitsNatureValidator.userId,benefitsNatureController.showByUserId);

/*
 * GET Username By ID
 */
// router.get("/users/:id", benefitsNatureValidator.benefitsNatureId, benefitsNatureController.showUsersBybenefitsNatureId);



/*
 * POST
 */
router.post("/", benefitsNatureValidator.create, benefitsNatureController.create);

/*
 * PUT
 */
router.put("/:id", benefitsNatureValidator.benefitsNatureId, benefitsNatureController.update);

/*
 * DELETE
 */
router.delete("/:id", benefitsNatureValidator.benefitsNatureId, benefitsNatureController.remove);


module.exports = router;
