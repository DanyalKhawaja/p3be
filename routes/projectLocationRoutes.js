const express = require("express");
const router = express.Router();
const projectLocationController = require("../controllers/projectLocationController");

router.get("/", projectLocationController.list);
router.get("/:projectId",  projectLocationController.show);
router.post("/", projectLocationController.create);
router.put("/:id", projectLocationController.update);
router.delete("/:id", projectLocationController.remove);

module.exports = router;
