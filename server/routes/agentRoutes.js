const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agentController");

router.post("/agent", agentController.upload.single("agentImage"), agentController.createAgent);
router.get("/agents", agentController.getAgents);
router.put("/agents/:id", agentController.upload.single("agentImage"), agentController.updateAgent);
router.delete("/agents/:id", agentController.deleteAgent);
router.get("/agent-properties", agentController.getUserProperties);
router.get("/agent-projects", agentController.getUserProjectsInquiries);

module.exports = router;