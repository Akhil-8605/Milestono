const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");

router.post("/enquiries", enquiryController.addEnquiry);
router.get("/enquiries", enquiryController.getEnquiries);
router.put("/enquiries/reached", enquiryController.updateEnquiryReached);
router.post("/property-enquiry", enquiryController.markAsPropertyEnquiry);
router.post("/project-enquiry", enquiryController.markAsProjectEnquiry);

module.exports = router;
