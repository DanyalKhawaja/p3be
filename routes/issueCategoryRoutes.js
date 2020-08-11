const express = require("express");
const router = express.Router();

const issueCategoryController = require("../controllers/issueCategoryController");
const issueCategoryValidator = require('../validators/issueCategoryValidator');



/*
 * GET
 */
router.get("/", issueCategoryController.list);

/*
 * GET By Project
 */
router.get("/byProject/:id", issueCategoryController.listByProject);


/*

/*
 * POST
 */
router.post("/", issueCategoryValidator.create, issueCategoryController.create);

/*
 * PUT
 */
router.put("/:id", issueCategoryController.update);

/*
 * DELETE
 */
router.delete("/:id", issueCategoryController.remove);


module.exports = router;
