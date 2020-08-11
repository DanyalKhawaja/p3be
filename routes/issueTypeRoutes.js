const express = require("express");
const router = express.Router();

const issueTypeController = require("../controllers/issueTypeController");
const issueTypeValidator = require("../validators/issueTypeValidator")



/*
 * GET
 */
router.get("/", issueTypeController.list);

/*
 * GET By Projetc
 */
router.get("/byProject/:id", issueTypeController.listByProject);

/*

/*
 * POST
 */
router.post("/", issueTypeValidator.create, issueTypeController.create);

/*
 * PUT
 */
router.put("/:id", issueTypeController.update);

/*
 * DELETE
 */
router.delete("/:id", issueTypeController.remove);


module.exports = router;
