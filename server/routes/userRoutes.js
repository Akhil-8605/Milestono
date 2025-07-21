const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/authenticate', userController.authenticate);
router.get('/userdetail',userController.getUserDetails);
router.get('/userdetails',userController.getAllUsersForAdmin);
router.get('/email',userController.getEmail);
router.put('/userprofile', userController.updateUserProfile);
router.put('/updatepassword', userController.updateUserPassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/verify-phone', userController.verifyPhone);
router.post('/verify-email', userController.verifyEmail);
router.post('/verify-delete-email', userController.verifyDeleteEmail);
router.post('/delete-account', userController.deleteAccount);
router.get('/user-data',userController.countOfUserData);

module.exports = router;
