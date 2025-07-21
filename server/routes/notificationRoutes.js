const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController.js");

router.get("/notification", notificationController.getNotificationsByToken);
router.patch("/notification/:id", notificationController.markAsRead);

module.exports = router;
