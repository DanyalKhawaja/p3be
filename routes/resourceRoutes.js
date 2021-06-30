const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");



/*
 * GET
 */
router.get("/", resourceController.list);

/*
 * GET
 */
router.get("/AllActive", resourceController.allActive);

/*
 * GET Resource By ID
 */
router.get("/:id", resourceController.show);

router.get("/availableResourceType/:projectId/:typeId/:startDate/:endDate/:wbsId", resourceController.showAvailableByResourceType);

router.get("/resourceSchedule/:resourceId/:startDate/:endDate", resourceController.showResourceSchedule);
router.get("/resourceTypeSchedule/:projectId/:resourceTypeId", resourceController.showResourceTypeSchedule);
router.get("/allocations/:projectId", resourceController.showResourceAllocations);
/*
 * GET Resource By ResourceType
 */
router.get("/byResourceType/:id", resourceController.showByResourceTypeId);

/*
 * POST
 */
router.post("/", resourceController.create);

/*
 * PUT
 */
router.put("/:id", resourceController.update);

/*
 * DELETE
 */
router.delete("/:id", resourceController.remove);


module.exports = router;
