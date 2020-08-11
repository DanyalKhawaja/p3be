const express = require("express");
const router = express.Router();

const issueStatusController = require("../controllers/issueStatusController");
const issueStatusValidator = require("../validators/issueStatusValidator");



/*
 * GET
 */
router.get("/", issueStatusController.list);

/*

/*
 * POST
 */
router.post("/",issueStatusValidator.create, issueStatusController.create);

/*
 * PUT
 */
router.put("/:id", issueStatusController.update);

/*
 * DELETE
 */
router.delete("/:id", issueStatusController.remove);


module.exports = router;
