const passport = require("passport");
const jwt = require('jsonwebtoken');
const url = process.env.FRONT_END_URL;


exports.googleAuthCallback = (req, res) => {
  if (req.user) {
    const token = jwt.sign({ email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`${url}/login?token=${token}`);
  } else {
    res.redirect(`${url}/login`);
  }
};

exports.loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, message: "User Login", user: req.user });
  } else {
    res.status(400).json({ success: false, message: "Not Authorized" });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(url);
  });
};
