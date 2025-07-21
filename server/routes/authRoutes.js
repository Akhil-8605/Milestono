const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const url = process.env.FRONT_END_URL;

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${url}/login` }), authController.googleAuthCallback);
router.get("/login/success", authController.loginSuccess);
router.get("/logout", authController.logout);

module.exports = router;
