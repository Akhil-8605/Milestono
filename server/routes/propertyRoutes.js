const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.post('/property_details', propertyController.upload.array('images'), propertyController.addPropertyDetails);
router.get('/property_details', propertyController.getAllProperties);
router.post('/search_properties', propertyController.searchProperties);
router.delete('/property_details/:id', propertyController.deletePropertyDetails);
router.put('/update_to_home_page/:id',propertyController.updateUserHomePage); 
router.put('/featured-property/:id',propertyController.markPropertyAsFeatured); 
router.get('/shared-property', propertyController.getUserProperties);

module.exports = router;
