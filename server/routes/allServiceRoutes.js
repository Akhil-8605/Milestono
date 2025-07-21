const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/allServiceController');

router.post('/serviceman_details', serviceController.upload.fields([
    { name: 'vendorImage', maxCount: 1 },
    { name: 'adharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
    { name: 'certificateImage', maxCount: 1 }
]), serviceController.createServiceman);
router.post('/problem_details',serviceController.upload.single('problemImage'), serviceController.createProblem);
router.get('/serviceman_details', serviceController.getAllServiceman);
router.get('/problem_details', serviceController.getAllProblems);
router.get('/pay-to-vendor', serviceController.getPayToProblems);
router.get('/users-requested-service', serviceController.getUserAllProblems);
router.get('/vendor-provides-service', serviceController.getVendorsAllProblems);
router.put('/accept_serviceman/:id',serviceController.acceptServiceman);
router.delete('/delete_serviceman/:id',serviceController.deleteServiceman);
router.put('/vendor_servicerequest/:id',serviceController.venderServiceRequest);
router.put('/admin_servicerequest/:id',serviceController.adminServiceRequest);
router.put('/pending_servicerequest/:id',serviceController.pendingServiceRequest);
router.put('/accept_servicerequest/:id',serviceController.acceptServiceRequest);
router.put('/done_servicerequest/:id',serviceController.doneServiceRequest);
router.put('/paid_servicerequest/:id',serviceController.updateServiceRequestToPaid);
router.put('/verify_servicerequest/:id', serviceController.verifyServiceRequest);
router.delete('/servicerequest/:id',serviceController.deleteServiceRequest);
router.get('/userservicedetail',serviceController.getServicemanDetails);
router.put('/update-service-profile', serviceController.updateServiceProfile);

module.exports = router;