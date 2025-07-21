const jwt = require('jsonwebtoken');
const Account = require('../models/account');
const User = require('../models/user');
const ContactViewed = require('../models/contactViewed');
const Property = require('../models/property');
const AccountHistory = require('../models/accountHistory');

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createAccount = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { numOfProperties, numOfContactDetails, numOfImages, numOfVideos, numOfFeaturedProperties, crmAccess, whatsappIntegration, exportCustomers, bulkUpload, branding, current, accountName, price } = req.body;
    const existingAccount = await Account.findOne({ email: decoded.email }).sort({ premiumEndDate: -1 });

    if (existingAccount) {
      const premiumStartDate = existingAccount.premiumEndDate;
      let premiumEndDate;
      if (current) {
        premiumEndDate = new Date(premiumStartDate);
        premiumEndDate.setMonth(premiumEndDate.getMonth() + 1);
      } else {
        premiumEndDate = new Date(premiumStartDate);
        premiumEndDate.setFullYear(premiumEndDate.getFullYear() + 1);
      }
      const newAccount = new Account({
        email: decoded.email,
        numOfProperties,
        numOfContactDetails,
        numOfImages,
        numOfVideos,
        numOfFeaturedProperties,
        crmAccess,
        whatsappIntegration,
        exportCustomers,
        bulkUpload,
        branding,
        premiumStartDate,
        premiumEndDate
      });

      try {
        await newAccount.save();
        const newHistory = new AccountHistory({
          email: decoded.email,
          accountName,
          price,
          paymentDate: new Date(),
          validityEndDate: premiumEndDate
        });
        await newHistory.save();

        res.status(201).json({ message: 'Account created successfully' });
      } catch (error) {
        console.error('Error creating account', error);
        res.status(500).json({ error: 'Failed to create account' });
      }
    } else {
      const premiumStartDate = new Date(); 
      let premiumEndDate;

      if (current) {
        premiumEndDate = new Date(premiumStartDate);
        premiumEndDate.setMonth(premiumEndDate.getMonth() + 1);
      } else {
        premiumEndDate = new Date(premiumStartDate);
        premiumEndDate.setFullYear(premiumEndDate.getFullYear() + 1);
      }

      const newAccount = new Account({
        email: decoded.email,
        numOfProperties,
        numOfContactDetails,
        numOfImages,
        numOfVideos,
        numOfFeaturedProperties,
        crmAccess,
        whatsappIntegration,
        exportCustomers,
        bulkUpload,
        branding,
        premiumStartDate,
        premiumEndDate
      });

      try {
        await newAccount.save();
        const newHistory = new AccountHistory({
          email: decoded.email,
          accountName,
          price,
          paymentDate: new Date(),
          validityEndDate: premiumEndDate
        });
        await newHistory.save();
        res.status(201).json({ message: 'Account created successfully' });
      } catch (error) {
        console.error('Error creating account', error);
        res.status(500).json({ error: 'Failed to create account' });
      }
    }
  });
};

const deleteAccount = async (req, res) => {
  try {
      const { id } = req.params;

      const deletedAccount = await Account.findByIdAndDelete(id);
      if (!deletedAccount) {
          return res.status(404).json({ message: 'Account not found.' });
      }

      res.status(200).json({ message: 'Account deleted successfully!' });
  } catch (error) {
      console.error('Error deleting Account:', error);
      res.status(500).json({ message: 'Failed to delete Account.' });
  }
};

const checkNumOfProperties = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const email = decoded.email;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const account = await Account.findOne({
        email,
        premiumStartDate: { $lte: new Date() },  
        premiumEndDate: { $gte: new Date() }  
      });
      const remainingProperties = user.numOfProperties + (account ? account.numOfProperties : 0);
      const canPost = (account && account.numOfProperties === -1) ? true : remainingProperties > 0;
      const bulkUpload = account?.bulkUpload ?? false;

      res.status(200).json({ canPost, bulkUpload });
    });
  } catch (error) {
    console.error('Error checking number of properties:', error);
    res.status(500).json({ message: 'Failed to check number of properties' });
  }
};

const markAsContactViewed = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { property_id } = req.body;
      const email = decoded.email;

      const existingViewed = await ContactViewed.findOne({ email, property_id });
      if (existingViewed) {
        return res.status(400).json({ message: 'Property already marked as viewed.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const account = await Account.findOne({
        email,
        premiumStartDate: { $lte: new Date() },  
        premiumEndDate: { $gte: new Date() }  
      });
      if (account && account.numOfContactDetails === -1) {
        account.numOfContactDetails = -1
      }
      else if (account && account.numOfContactDetails > 0) {
        account.numOfContactDetails -= 1;
      } else if (user.numOfContactDetails > 0) {
        user.numOfContactDetails -= 1;
      } else {
        return res.status(403).json({ error: 'No contact details available to view. Please upgrade to a premium account.' });
      }

      await account && account.save();
      await user.save();

      const viewed = new ContactViewed({ email, property_id });
      await viewed.save();

      res.status(201).json({ message: 'Property marked as viewed.' });
    });
  } catch (error) {
    console.error('Error marking property as viewed:', error);
    res.status(500).json({ message: 'Failed to mark property as viewed.' });
  }
};

const checkContactViewedStatus = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { property_id } = req.params;
      const email = decoded.email;

      const property = await Property.findById(property_id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.ownerEmail === email) {
        return res.status(200).json({ viewed: true });
      }

      const viewed = await ContactViewed.findOne({ email, property_id });
      if (viewed) {
        res.status(200).json({ viewed: true });
      } else {
        res.status(200).json({ viewed: false });
      }
    });
  } catch (error) {
    console.error('Error checking viewed property status:', error);
    res.status(500).json({ message: 'Failed to check viewed property status.' });
  }
};

const checkWhatsappStatus = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { property_id } = req.params;
      const email = decoded.email;

      const property = await Property.findById(property_id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.ownerEmail === email) {
        return res.status(200).json({contacted: true });
      }

      const account = await Account.findOne({
        email,
        premiumStartDate: { $lte: new Date() },  
        premiumEndDate: { $gte: new Date() }  
      });
      if (account.whatsappIntegration) {
        res.status(200).json({contacted: true });
      } else {
        res.status(200).json({contacted: false });
      }
    });
  } catch (error) {
    console.error('Error checking viewed property status:', error);
    res.status(500).json({ message: 'Failed to check viewed property status.' });
  }
};


const checkInquriesStatus = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const email = decoded.email;


      const account = await Account.findOne({
        email,
        premiumStartDate: { $lte: new Date() },  
        premiumEndDate: { $gte: new Date() }  
      });
      const status = account ? account.exportCustomers : "no";
      res.status(200).json({ "status" : status });
    });
  } catch (error) {
    console.error('Error checking viewed property status:', error);
    res.status(500).json({ message: 'Failed to check viewed property status.' });
  }
};


const getUnlockedProperties = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const email = decoded.email;

      const unlockedProperties = await ContactViewed.find({ email })
        .populate({
          path: 'property_id',
          match: {}, 
        })
        .exec();

      const validProperties = unlockedProperties
        .filter(viewed => viewed.property_id !== null)
        .map(viewed => viewed.property_id);

      if (validProperties.length === 0) {
        return res.status(404).json({ message: 'No unlocked properties found for this user.' });
      }

      res.status(200).json(validProperties);
    });
  } catch (error) {
    console.error('Error fetching unlocked properties:', error);
    res.status(500).json({ message: 'Failed to fetch unlocked properties.' });
  }
};


const checkCountContactViewedStatus = async (req, res) => {
  try {
    const { property_id } = req.params;

    const count = await ContactViewed.countDocuments({ property_id });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error checking contact viewed count:', error);
    res.status(500).json({ message: 'Failed to check contact viewed count.' });
  }
};
const getAllAccountHistories = async (req, res) => {
  try {
    const accountHistories = await AccountHistory.find().sort({ paymentDate: -1 });
    res.json(accountHistories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAccountHistoriesByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const accountHistories = await AccountHistory.find({ email }).sort({ paymentDate: -1 });
    if (!accountHistories.length) {
      return res.status(404).json({ message: 'No account histories found for this email' });
    }
    res.json(accountHistories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkCrmAccess = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const account = await Account.findOne({
      email,
      premiumStartDate: { $lte: new Date() },  
      premiumEndDate: { $gte: new Date() }  
    }).select('crmAccess');

    if (!account) {
      return res.status(200).json({ crmAccess: false });
    }

    res.status(200).json({ crmAccess: account.crmAccess || false });
  } catch (error) {
    console.error('Error checking CRM access:', error);
    res.status(500).json({ message: 'Failed to check CRM access' });
  }
};


module.exports = {
  getAllAccounts,
  createAccount,
  deleteAccount,
  checkNumOfProperties,
  markAsContactViewed,
  checkContactViewedStatus,
  checkWhatsappStatus,
  checkInquriesStatus,
  checkCountContactViewedStatus,
  getUnlockedProperties,
  getAllAccountHistories,
  getAccountHistoriesByEmail,
  checkCrmAccess,
};
