
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

router.post("/feedback", feedbackController.addFeedback);
router.get("/feedback", feedbackController.getFeedback);
router.put("/home-feedback", feedbackController.updateIsOnHomePage);

module.exports = router;
