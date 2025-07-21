
const express = require('express');
const router = express.Router();
const AgentDashboardController = require('../controllers/agentDashboardController.js');

router.get('/agent-details', AgentDashboardController.getUserInsights);
router.get('/last-6-month-agent-property-details', AgentDashboardController.getLast6MonthsPerformance);
router.get('/stats-of-agent-properties', AgentDashboardController.getPropertyStatisticsByPostedProperties);
router.get('/last-6-month-agent-contacted', AgentDashboardController.getLast6MonthsViewsVsContacted);
router.get('/agent-top-properties', AgentDashboardController.getAgentTopProperties);
router.get('/agent-inquiry-insights', AgentDashboardController.getInquiryInsights);
router.get('/agent-inquiry-trends-by-type', AgentDashboardController.getInquiryTrendsByType);
router.get('/agent-total-inquiry-by-type', AgentDashboardController.getTotalInquiryByType);
router.get('/agent-top-properties-by-inquiries', AgentDashboardController.getTopPropertiesByInquiries);
router.get('/agent-views-vs-inquiries', AgentDashboardController.getLast6MonthsViewsVsInquiries);


module.exports = router;
