const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Property = require('../models/property');
const ContactViewed = require('../models/contactViewed');
const RecentViewed = require('../models/recentViewed');
const Saved = require('../models/saved');
const Serviceman = require('../models/serviceman');
const Servicerequest = require('../models/servicerequest');
const Account = require('../models/account')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const registerUser = async (req, res) => { 
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    
    if (existingUser) {
        const emailConflict = existingUser.email === email;
        const phoneConflict = existingUser.phone === phone;
      
        if (emailConflict && phoneConflict) {
          return res.status(409).json({ error: "Both Email and Phone already in use" });
        } else if (emailConflict) {
          return res.status(409).json({ error: "Email already in use" });
        } else if (phoneConflict) {
          return res.status(409).json({ error: "Phone already in use" });
        }
    }
    const newUser = new User({
      fullName: name,
      email,
      phone,
      password,
      role: "user",
      profile: "",

      numOfProperties: 3,

      numOfContactDetails: 3,

      numOfImages: 5,

      numOfVideos: 0,

      numOfFeaturedProperties: 0,

      crmAccess: false,
      whatsappIntegration: false,

      exportCustomers: "no",
      bulkUpload: false,

      branding: "no",
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
          const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({ token, user_id: user._id.toString(), user_role: user.role });
        })
        .catch(bcryptErr => {
          console.error(bcryptErr);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
};

const getUserDetails = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    User.findOne({ email: decoded.email })
      .then(existingUser => {
        if (existingUser) {
          return res.json(existingUser);
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      })
      .catch(err => {
        console.error('Error finding user', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

const getAllUsersForAdmin = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    User.find()
      .then(users => {
        if (users && users.length > 0) {
          return res.json(users);
        } else {
          return res.status(404).json({ error: 'No users found' });
        }
      })
      .catch(err => {
        console.error('Error retrieving users', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};


const adminLogin = (req, res) => {
  loginUser(req, res);
};

const authenticate = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role === 'user') {
      try {
        const user = await User.findOne({ email: decoded.email });
        if (user && !user.phone) {
          return res.json({ role: decoded.role, addPhone: true });
        }
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    res.json({ role: decoded.role });
  });
};


const getEmail = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ email: decoded.email });
  });
};



const authenticateUser = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ message: 'User authenticated' });
  });
};

const authenticateAdmin = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ message: 'Admin authenticated' });
  });
};

const updateUserProfile = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { phone } = req.body;

    const updateProcess = async () => {
      try {
        if (phone) {
          const existingUser = await User.findOne({ phone });
          if (existingUser && existingUser.email !== decoded.email) {
            return res.status(409).json({ error: 'Phone number already in use' });
          }
        }

        const updatedUser = await User.findOneAndUpdate(
          { email: decoded.email },
          req.body,
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
      } catch (err) {
        console.error('Error updating user profile', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

    updateProcess();
  });
};


const updateUserPassword = (req, res) => {
  const token = req.headers.authorization;
  const { currentPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    User.findOne({ email: decoded.email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(currentPassword, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json({ error: 'Current password is incorrect' });
            }

            bcrypt.hash(newPassword, 12)
              .then(hashedPassword => {
                user.password = hashedPassword;
                user.save()
                  .then(() => res.json({ message: 'Password updated successfully' }))
                  .catch(saveErr => {
                    console.error('Error saving new password', saveErr);
                    res.status(500).json({ error: 'Internal server error' });
                  });
              })
              .catch(hashErr => {
                console.error('Error hashing new password', hashErr);
                res.status(500).json({ error: 'Internal server error' });
              });
          })
          .catch(compareErr => {
            console.error('Error comparing passwords', compareErr);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(err => {
        console.error('Error finding user', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Milestono Support" <${process.env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: "Milestono Password Reset Request",
        text: `Dear User,\n\nWe received a request to reset your password for your Milestono account.\n\nPlease click the link below to reset your password:\n\n${process.env.FRONT_END_URL}/reset-password/${token}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMilestono.com Support Team`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email", err);
          return res.status(500).json({ error: "Error sending email" });
        }
        res.json({ message: "Password reset link sent" });
      });
    })
    .catch(err => {
      console.error("Error finding user", err);
      res.status(500).json({ error: "Internal server error" });
    });
};


const resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    User.findOne({ email: decoded.email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        user.password = newPassword;
        user.save()
          .then(() => {
            res.status(201).json({ message: 'Password Updated successfully' });
          })
          .catch(saveErr => {
            console.error('Error saving user', saveErr);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch(err => {
        console.error('Error finding user', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
};

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const verifyPhone = async (req, res) => {
  const { phone } = req.body;
  const otp = generateOtp();

  try {
    await twilioClient.messages.create({
      body: `Your Milestono verification code is ${otp}. Do not share it with anyone. - Milestono.com`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+91" + phone,
    });
    res.status(200).json({ otp });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS" });
  }
};


const verifyEmail = async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const mailOptions = {
  //   from: `"Milestono Support" <${process.env.EMAIL_USERNAME}>`,
  //   to: email,
  //   subject: "Milestono Verification Code",
  //   text: `Dear User,\n\nYour Milestono verification code is: ${otp}\n\nPlease do not share this code with anyone.\n\nBest regards,\nMilestono.com`,
  // };

  try {
    // await transporter.sendMail(mailOptions);
    res.status(200).json({ otp });
    console.log("Email OTP:", otp);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};


const verifyDeleteEmail = async (req, res) => {
  const token = req.headers.authorization;
  const { email } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email) {
      return res.status(403).json({ error: "Forbidden: Email does not match" });
    }
    const otp = generateOtp();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Milestono Support" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Milestono Account Deletion Verification Code",
      text: `Dear User,\n\nWe received a request to delete your Milestono account.\n\nYour verification code is: ${otp}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMilestono.com`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ otp });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else {
      console.error("Error:", err);
      return res.status(500).json({ error: "Failed to process request" });
    }
  }
};


const deleteAccount = (req, res) => {
  const token = req.headers.authorization;
  const { email } = req.body; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (decoded.email !== email) {
      return res.status(403).json({ error: 'Forbidden: Email does not match' });
    }

    try {
      const deletedUser = await User.findOneAndDelete({ email });
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      await Property.deleteMany({ email }); 
      await ContactViewed.deleteMany({ email });
      await RecentViewed.deleteMany({ email });
      await Saved.deleteMany({ email });
      await Serviceman.deleteMany({ email });
      await Servicerequest.deleteMany({ email });

      return res.json({ message: 'Account and all associated data deleted successfully' });
    } catch (err) {
      console.error('Error deleting user or properties:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};

const countOfUserData = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
        const countOfContactedProperty = await ContactViewed.countDocuments({ email: decoded.email });
        const countOfSavedProperty = await Saved.countDocuments({ email: decoded.email });
        const countOfPostedProperty = await Property.countDocuments({ email: decoded.email });
        const countOfRequestedService = await Servicerequest.countDocuments({ email: decoded.email });
        const countOfProvidedService = await Servicerequest.countDocuments({ vendorEmail: decoded.email });
        const user = await User.findOne({ email: decoded.email });
        const account = await Account.findOne({ email: decoded.email }).sort({ premiumEndDate: -1 });
        const userFullName = user && user.fullName ? user.fullName : null;
        const premiumEndDate = account && account.premiumEndDate ? account.premiumEndDate : null;

        res.status(200).json({
          userFullName,
          premiumEndDate,
          countOfContactedProperty,
          countOfSavedProperty,
          countOfPostedProperty,
          countOfRequestedService,
          countOfProvidedService
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Failed to verify token.' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  authenticateUser,
  authenticateAdmin,
  getUserDetails,
  getAllUsersForAdmin,
  authenticate,
  updateUserProfile,
  updateUserPassword,
  getEmail,
  forgotPassword,
  resetPassword,
  verifyPhone,
  verifyEmail,
  countOfUserData,
  verifyDeleteEmail,
  deleteAccount,
};