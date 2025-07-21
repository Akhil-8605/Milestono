const Enquiry = require("../models/enquiry");
const PropertyEnquiry = require("../models/propertyEnquiry");
const ProjectEnquiry = require("../models/projectEnquiry");

const jwt = require('jsonwebtoken');

const addEnquiry = async (req, res) => {
  try {
    const { name, phone, email, location, propertyType, description } = req.body;

    const newEnquiry = new Enquiry({
      name,
      phone,
      email,
      location,
      propertyType,
      description,
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting enquiry", error });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiries", error });
  }
};

const updateEnquiryReached = async (req, res) => {
  try {
    const { _id } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      _id,
      { reached : true },
      { new: true } 
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ message: "Enquiry updated successfully!", enquiry });
  } catch (error) {
    res.status(500).json({ message: "Error updating enquiry", error });
  }
};

const markAsPropertyEnquiry = async (req, res) => {
  try {
      const token = req.headers.authorization;

      if (!token) {
          return res.status(401).json({ message: 'Authentication token required.' });
      }

      let email;
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          email = decoded.email;
      } catch (err) {
          return res.status(401).json({ message: 'Invalid token.' });
      }

      const { property_id } = req.body;
      await PropertyEnquiry.deleteOne({ email, property_id });

      const enquiry = new PropertyEnquiry({ email, property_id });
      await enquiry.save();

      res.status(201).json({ message: 'Property marked as enquired.' });

  } catch (error) {
      console.error('Error marking property as enquired:', error);
      res.status(500).json({ message: 'Failed to mark property as enquired.' });
  }
};

const markAsProjectEnquiry = async (req, res) => {
  try {
      const token = req.headers.authorization;

      if (!token) {
          return res.status(401).json({ message: 'Authentication token required.' });
      }

      let email;
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          email = decoded.email;
      } catch (err) {
          return res.status(401).json({ message: 'Invalid token.' });
      }

      const { project_id } = req.body;
      await ProjectEnquiry.deleteOne({ email, project_id });

      const enquiry = new ProjectEnquiry({ email, project_id });
      await enquiry.save();

      res.status(201).json({ message: 'Project marked as enquired.' });

  } catch (error) {
      console.error('Error marking project as enquired:', error);
      res.status(500).json({ message: 'Failed to mark project as enquired.' });
  }
};


module.exports = {
  addEnquiry,
  getEnquiries,
  updateEnquiryReached,
  markAsPropertyEnquiry,
  markAsProjectEnquiry,
};
