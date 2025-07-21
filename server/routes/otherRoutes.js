
const express = require('express');
const router = express.Router();
const otherController = require('../controllers/otherController');

router.post('/save-property', otherController.markAsSaved);
router.post('/unsave-property', otherController.unSaveProperty);
router.get('/saved/:property_id', otherController.checkSavedStatus);
router.get('/saved-property', otherController.getSavedProperties);
router.post('/mark-view', otherController.markAsViewed);
router.get('/get-recent-property', otherController.getLastViewedProperties);

module.exports = router;
