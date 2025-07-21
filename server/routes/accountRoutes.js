
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts', accountController.getAllAccounts);
router.post('/accounts', accountController.createAccount);
router.delete('/accounts/:id', accountController.deleteAccount);
router.get('/check-num-of-properties', accountController.checkNumOfProperties);
router.post('/contact-viewed', accountController.markAsContactViewed);
router.get('/contact-viewed/:property_id', accountController.checkContactViewedStatus);
router.get('/whatsapp-status/:property_id', accountController.checkWhatsappStatus);
router.get('/check-export-status', accountController.checkInquriesStatus);
router.get('/unlocked-property', accountController.getUnlockedProperties);
router.get('/count-contact-viewed/:property_id', accountController.checkCountContactViewedStatus);
router.get('/account-histories', accountController.getAllAccountHistories);
router.get('/account-history/:email', accountController.getAccountHistoriesByEmail);
router.get('/crm-access', accountController.checkCrmAccess);


module.exports = router;
