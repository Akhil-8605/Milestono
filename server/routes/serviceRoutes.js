const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.post("/services", serviceController.upload.single("serviceImage"), serviceController.createService);
router.get("/services", serviceController.getAllServices);
router.get("/services/:id", serviceController.getService);
router.patch("/services/:id", serviceController.updateService);
router.delete("/services/:id", serviceController.deleteService);
router.get("/services/category/:category", serviceController.getServicesByCategory);
router.get("/services/status/:status", serviceController.getServicesByStatus);
router.get("/services-requests", serviceController.getServicesByCustomerId);
router.post("/services/paid-service/:id", serviceController.markServiceAsPaid);
router.get("/services-vendor", serviceController.getServicesByVendorId);
router.post("/services/distance/:id", serviceController.calculateDistance);
router.get("/services/nearby", serviceController.getNearbyServices);
router.post("/services/nearby/category", serviceController.getNearbyServicesByCategory);
router.post("/services/verify-otp", serviceController.verifyServiceOTP);

module.exports = router;
