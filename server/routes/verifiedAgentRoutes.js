const express = require('express');
const router = express.Router();
const verifiedAgentController = require("../controllers/verifiedAgentController");

const cpUpload = verifiedAgentController.upload.fields([
  { name: 'profile', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

router.get('/verified-agent', verifiedAgentController.getAgent);
router.get('/verified-all-agents', verifiedAgentController.getAllAgents);
router.post('/verified-agents-by-city', verifiedAgentController.getAgentsByCityState);
router.post('/verified-agent', cpUpload, verifiedAgentController.addOrUpdateAgent);
router.post('/append-documents', verifiedAgentController.upload.fields([{ name: 'documents', maxCount: 10 }]), verifiedAgentController.appendDocuments);
router.delete('/verified-agent', verifiedAgentController.deleteAgent);

module.exports = router;
