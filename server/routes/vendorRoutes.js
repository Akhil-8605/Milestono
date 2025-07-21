const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

router.post(
  "/vendors",
  vendorController.upload.fields([
    { name: "vendorImage", maxCount: 1 },
    { name: "adharImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "certificateImage", maxCount: 1 },
  ]),
  vendorController.createVendor
);

router.get("/vendors", vendorController.getAllVendors);
router.get("/vendors/:id", vendorController.getVendor);
router.patch("/vendors", vendorController.updateVendor);
router.patch("/vendors/quote", vendorController.addQuotedService);
router.delete("/vendors/:id", vendorController.deleteVendor);
router.get("/vendors/service/:category", vendorController.getVendorsByService);
router.get("/vendors/nearby", vendorController.getNearbyVendors);
router.get('/vendors/by-service/:serviceId', vendorController.getVendorsByServiceId);
router.get('/vendors/by-user/:userId', vendorController.getVendorByUserId);
router.post('/vendors/:id/reviews', vendorController.addReview);
router.patch('/vendors/:vendorId/reviews/:reviewId', vendorController.updateReview);
router.delete('/vendors/:vendorId/reviews/:reviewId', vendorController.deleteReview);
router.get('/vendors/:id/reviews', vendorController.getVendorReviews);

module.exports = router;
