const jwt = require('jsonwebtoken');
const Agent = require("../models/agent");
const multer = require("multer");
const ContactViewed = require("../models/contactViewed");
const PropertyEnquiry = require("../models/propertyEnquiry");
const Property = require("../models/property");
const User = require('../models/user');
const ProjectEnquiry = require('../models/projectEnquiry');
const Project = require('../models/project');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createAgent = async (req, res) => {
    try {
        const { name, company, operatingSince, buyersServed, propertiesForSale, propertiesForRent, address } = JSON.parse(req.body.formData);
        const agentImage = req.file;
        let image = null;
        if (agentImage) {
            const base64String = agentImage.buffer.toString("base64");
            image = `data:${agentImage.mimetype};base64,${base64String}`;
        } else {
            return res.status(400).json({ message: "Image is required." });
        }
        
        const newAgent = new Agent({
            name,
            company,
            operatingSince,
            buyersServed,
            propertiesForSale,
            propertiesForRent,
            image,
            address,
        });
        
        const savedAgent = await newAgent.save();
        res.status(201).json(savedAgent);
    } catch (error) {
        res.status(500).json({ message: "Failed to create agent", error });
    }
};

const getAgents = async (req, res) => {
    try {
        const agents = await Agent.find();
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch agents", error });
    }
};

const updateAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, operatingSince, buyersServed, propertiesForSale, propertiesForRent,address } = JSON.parse(req.body.formData);
        const agentImage = req.file;
        let image = null;
        if (agentImage) {
            const base64String = agentImage.buffer.toString("base64");
            image = `data:${agentImage.mimetype};base64,${base64String}`;
        } else {
            return res.status(400).json({ message: "Image is required." });
        }

        const updatedAgent = await Agent.findByIdAndUpdate(id, {
            name,
            company,
            operatingSince,
            buyersServed,
            propertiesForSale,
            propertiesForRent,
            image,
            address
        }, { new: true });

        if (!updatedAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json(updatedAgent);
    } catch (error) {
        res.status(500).json({ message: "Failed to update agent", error });
    }
};

const deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAgent = await Agent.findByIdAndDelete(id);

        if (!deletedAgent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json({ message: "Agent deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete agent", error });
    }
};

const getUserProperties = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      const properties = await Property.find({ email }).select('_id heading landmark');
      if (!properties.length) return res.status(404).json({ message: 'No properties found for this user.' });
  
      const propertyMap = Object.fromEntries(properties.map(prop => [prop._id.toString(), [prop.heading, prop.landmark]]));
      const propertyIds = Object.keys(propertyMap);
  
      const contactViews = await ContactViewed.find({ property_id: { $in: propertyIds } }).select('email property_id createdAt');
  
      const propertyInquiries = await PropertyEnquiry.find({ property_id: { $in: propertyIds } }).select('email property_id createdAt');
  
      const contactEmails = contactViews.map(cv => cv.email);
      const inquiryEmails = propertyInquiries.map(eq => eq.email);
      const allUserEmails = [...new Set([...contactEmails, ...inquiryEmails])];
  
      const users = await User.find({ email: { $in: allUserEmails } }).select('fullName email phone');
      const userMap = Object.fromEntries(users.map(user => [user.email, user]));
  
      const contactResults = contactViews.map(cv => {
        const user = userMap[cv.email];
        if (!user) return null;
        return {
          heading: propertyMap[cv.property_id]?.[0] || "Unknown Property",
          landmark: propertyMap[cv.property_id]?.[1] || "Unknown Landmark",
          name: user.fullName,
          email: user.email,
          mob: user.phone,
          date: cv.createdAt,
          status: "Contacted"
        };
      }).filter(Boolean);
  
      const inquiryResults = propertyInquiries.map(eq => {
        const user = userMap[eq.email];
        if (!user) return null;
        return {
          heading: propertyMap[eq.property_id]?.[0] || "Unknown Property",
          landmark: propertyMap[eq.property_id]?.[1] || "Unknown Landmark",
          name: user.fullName,
          email: user.email,
          mob: user.phone,
          date: eq.createdAt,
          status: "Enquired"
        };
      }).filter(Boolean);
  
      const combined = [...contactResults, ...inquiryResults].sort((a, b) => new Date(b.date) - new Date(a.date));
  
      res.status(200).json(combined);
    } catch (error) {
      console.error('Error retrieving contact and enquiry details:', error);
      res.status(500).json({ message: 'Failed to retrieve contact and enquiry details.' });
    }
  };

  const getUserProjectsInquiries = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      const projects = await Project.find({ email }).select('_id title city');
      if (!projects.length) return res.status(404).json({ message: 'No projects found for this user.' });
  
      const projectMap = Object.fromEntries(projects.map(proj => [proj._id.toString(), [proj.title, proj.city]]));
      const projectIds = Object.keys(projectMap);
  
      const projectInquiries = await ProjectEnquiry.find({ project_id: { $in: projectIds } }).select('email project_id createdAt');
      const inquiryEmails = [...new Set(projectInquiries.map(iq => iq.email))];
  
      const users = await User.find({ email: { $in: inquiryEmails } }).select('fullName email phone');
      const userMap = Object.fromEntries(users.map(user => [user.email, user]));
  
      const inquiryResults = projectInquiries.map(iq => {
        const user = userMap[iq.email];
        if (!user) return null;
        return {
          title: projectMap[iq.project_id]?.[0] || "Unknown Project",
          city: projectMap[iq.project_id]?.[1] || "Unknown City",
          name: user.fullName,
          email: user.email,
          mob: user.phone,
          date: iq.createdAt,
          status: "Enquired"
        };
      }).filter(Boolean);
  
      const sortedResults = inquiryResults.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.status(200).json(sortedResults);
    } catch (error) {
      console.error('Error retrieving project inquiry details:', error);
      res.status(500).json({ message: 'Failed to retrieve project inquiry details.' });
    }
  };
  
  
module.exports = {
    createAgent,
    getAgents,
    updateAgent,
    deleteAgent,
    getUserProperties,
    getUserProjectsInquiries,
    upload,
};
