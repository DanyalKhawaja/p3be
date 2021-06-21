const express = require("express");
const router = express.Router();

const boqController = require("../controllers/boqController");
const boqValidator = require("../validators/boqValidator")



/*
 * GET
 */
router.get("/", boqController.list);
router.get("/admin", boqController.adminList);


/*

/*
 * POST
 */
router.post("/", boqController.create);

/*
 * PUT
 */
router.put("/:id", boqController.update);

/*
 * DELETE
 */
router.delete("/:id", boqController.remove);


module.exports = router;
