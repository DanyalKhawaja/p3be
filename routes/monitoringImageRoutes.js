const express = require("express");
const passport = require('passport');

const router = express.Router();
const monitoringImageController = require("../controllers/monitoringImageController");
const monitoringImgValidation= require('../validators/monitoringImgValidation')

/*
 * GET
 */
router.get("/", monitoringImageController.list);

/*
 * GET User By ID
 */
router.get("/:id", monitoringImageController.show);

/*
 * PUT
 */
router.post("/",  monitoringImageController.imageUpload);

/*
 * PUT
 */
router.put("/:id", monitoringImageController.update);

/*
 * DELETE
 */
router.delete("/:id", monitoringImageController.remove);

/*
 * GET Username By ID
 */
router.get("/monitoringtId/:id", monitoringImageController.showByMonitoringtId);

router.post('/upload', monitoringImageController.imageUpload);

module.exports = router;
