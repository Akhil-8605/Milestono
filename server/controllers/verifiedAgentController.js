const jwt = require('jsonwebtoken');
const VerifiedAgent = require('../models/VerifiedAgent');
const multer = require('multer');
const NodeGeocoder = require('node-geocoder');
const Account = require('../models/account');

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, 
    fileSize: 10 * 1024 * 1024,
    files: 12,
  }
});

const getAgent = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = await VerifiedAgent.findOne({ email: decoded.email });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const getAllAgents = async (req, res) => {
  try {
    const agents = await VerifiedAgent.find();

    const agentEmails = [...new Set(agents.map(agent => agent.email))];

    const accounts = await Account.find({
      email: { $in: agentEmails },
      premiumStartDate: { $lte: new Date() },
      premiumEndDate: { $gte: new Date() }
    }).select("email branding");

    const brandingMap = Object.fromEntries(accounts.map(acc => [acc.email, acc.branding]));

    const agentsWithBranding = agents.map(agent => ({
      ...agent.toObject(),
      branding: brandingMap[agent.email] || null,
    }));

    res.status(200).json(agentsWithBranding);
  } catch (error) {
    console.error('Error fetching agent man details:', error);
    res.status(500).json({ message: 'Failed to fetch agent man details.' });
  }
};

const getAgentsByCityState = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required." });
  }

  try {
    const geoRes = await geocoder.reverse({ lat: latitude, lon: longitude });

    if (!geoRes.length) {
      return res.status(404).json({ message: "Could not determine city/state from coordinates." });
    }

    const result = geoRes[0];
    const cityFromMap = result.city?.trim().toLowerCase() || result.administrativeLevels?.level2long?.trim().toLowerCase();
    const stateFromMap = result.state?.trim().toLowerCase() || result.administrativeLevels?.level1long?.trim().toLowerCase();

    if (!cityFromMap || !stateFromMap) {
      return res.status(400).json({ message: "Could not extract valid city/state from coordinates." });
    }

    const allAgents = await VerifiedAgent.find();
    const matchingAgents = allAgents.filter((agent) => {
      const agentCity = agent.city?.trim().toLowerCase();
      const agentState = agent.state?.trim().toLowerCase();
      return agentCity === cityFromMap && agentState === stateFromMap;
    });

    const agentEmails = [...new Set(matchingAgents.map(agent => agent.email))];
    const accounts = await Account.find({
      email: { $in: agentEmails },
      premiumStartDate: { $lte: new Date() },
      premiumEndDate: { $gte: new Date() }
    }).select("email branding");

    const brandingMap = Object.fromEntries(accounts.map(acc => [acc.email, acc.branding]));

    const agentsWithBranding = matchingAgents.map(agent => ({
      ...agent.toObject(),
      branding: brandingMap[agent.email] || null,
    }));

    res.status(200).json(agentsWithBranding);
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    res.status(500).json({ message: "Failed to determine location from coordinates." });
  }
};

const addOrUpdateAgent = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: 'Token required' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const formData = req.body;
      if (formData.specializations && typeof formData.specializations === 'string') {
        try {
          formData.specializations = JSON.parse(formData.specializations);
        } catch {
          formData.specializations = [formData.specializations];
        }
      }

  
      if (req.files?.profile?.[0]) {
        const profileFile = req.files.profile[0];
        formData.profile = `data:${profileFile.mimetype};base64,${profileFile.buffer.toString('base64')}`;
      }

      if (req.files?.logo?.[0]) {
        const logoFile = req.files.logo[0];
        formData.logo = `data:${logoFile.mimetype};base64,${logoFile.buffer.toString('base64')}`;
      }
  
      if (req.files?.documents) {
        const uploadedDocs = req.files.documents.map(file => (`data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        ));
        const uploadedDocNs = req.files.documents.map(file => (file.originalname));
        formData.documentNames = uploadedDocNs;
        formData.documents = uploadedDocs;
      }
  
      const existing = await VerifiedAgent.findOne({ email });
  
      if (existing) {
        await VerifiedAgent.updateOne({ email }, formData);
        res.json({ message: 'Profile updated' });
      } else {
        const newAgent = new VerifiedAgent({ ...formData, email });
        await newAgent.save();
        res.status(201).json({ message: 'Profile created' });
      }
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ message: 'Failed to save profile' });
    }
  };

  const appendDocuments = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: 'Token required' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      const newDocuments = req.files?.documents?.map(file => (
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      )) || [];
  
      const newDocNames = req.files?.documents?.map(file => file.originalname) || [];
  
      if (!newDocuments.length) {
        return res.status(400).json({ message: 'No documents uploaded' });
      }
  
      const result = await VerifiedAgent.updateOne(
        { email },
        {
          $push: {
            documents: { $each: newDocuments },
            documentNames: { $each: newDocNames }
          }
        }
      );
  
      res.json({ message: 'Documents appended', result });
    } catch (err) {
      console.error('Append documents error:', err);
      res.status(500).json({ message: 'Failed to append documents' });
    }
  };
  
  
  

const deleteAgent = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await VerifiedAgent.deleteOne({ email: decoded.email });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile' });
  }
};

module.exports = {
  upload,
  getAgent,
  getAllAgents,
  addOrUpdateAgent,
  deleteAgent,
  appendDocuments,
  getAgentsByCityState
};
