const Vendor = require("../models/vendorModel");
const Service = require("../models/serviceModel");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const path = require("path");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createVendor = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const {
        vendorName,
        serviceRoll,
        vendorDescription,
        experience,
        district,
        state,
        subDistrict,
        address,
        serviceCategory,
        accountNo,
        ifsccode,
        adharNumber,
        panNumber,
        detailsRead,
      } = JSON.parse(req.body.formData);

      const files = req.files;

      const toBase64 = (file) =>
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const vendorData = {
        vendorName,
        serviceRoll,
        vendorDescription,
        experience,
        district,
        state,
        subDistrict,
        address,
        serviceCategory,
        accountNo,
        ifsccode,
        adharNumber,
        panNumber,
        detailsRead,
        email: decoded.email,
      };

      
      if (files?.vendorImage?.[0]) {
        vendorData.vendorImage = toBase64(files.vendorImage[0]);
      }
      if (files?.adharImage?.[0]) {
        vendorData.adharImage = toBase64(files.adharImage[0]);
      }
      if (files?.panImage?.[0]) {
        vendorData.panImage = toBase64(files.panImage[0]);
      }
      if (files?.certificateImage?.[0]) {
        vendorData.certificateImage = toBase64(files.certificateImage[0]);
      }

      try {
        const existingVendor = await Vendor.findOne({ email: decoded.email });

        if (existingVendor) {
          const updatedVendor = await Vendor.findOneAndUpdate(
            { email: decoded.email },
            { $set: vendorData },
            { new: true }
          );
          return res.status(200).json({ message: 'Vendor updated', vendor: updatedVendor });
        }

        if (!files?.vendorImage?.[0]) {
          return res.status(400).json({ message: "Vendor image is required for new vendor." });
        }

        vendorData.vendorImage = toBase64(files.vendorImage[0]);
        const newVendor = new Vendor(vendorData);
        const savedVendor = await newVendor.save();
        res.status(201).json({ message: 'Vendor created', vendor: savedVendor });

      } catch (dbError) {
        console.error(dbError);
        res.status(500).json({ message: "Database operation failed", error: dbError });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to process vendor", error });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}).sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getVendor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ error: "No such vendor" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const addQuotedService = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      const { serviceId, price } = req.body;
    
      if (!serviceId || !price) {
        return res.status(400).json({ message: "Service ID and price are required" });
      }

      const vendor = await Vendor.findOne({ email: decoded.email });

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const existingQuoteIndex = vendor.quotedServices.findIndex(
        (quote) => quote.serviceId === serviceId
      );

      if (existingQuoteIndex !== -1) {
        vendor.quotedServices[existingQuoteIndex].price = price;
      } else {
        vendor.quotedServices.push({ serviceId, price });
      }

      const updatedVendor = await vendor.save();

      const service = await Service.findById(serviceId);
      if (service) {
        service.status = "quoted";
        await service.save();
      }
      
      res.status(200).json({ message: "Quote added/updated", vendor: updatedVendor });
    });
  } catch (error) {
    console.error("Error adding quote:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



const updateVendor = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      const vendor = await Vendor.findOneAndUpdate(
        { email: decoded.email },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!vendor) {
        return res.status(404).json({ error: "No vendor found for this email" });
      }

      res.status(200).json(vendor);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteVendor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findOneAndDelete({ _id: id });
    if (!vendor) {
      return res.status(404).json({ error: "No such vendor" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getVendorsByService = async (req, res) => {
  const { category } = req.params;

  try {
    const vendors = await Vendor.find({ serviceCategory: category });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getNearbyVendors = async (req, res) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query; 

  try {
    const vendors = await Vendor.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getVendorByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const vendor = await Vendor.findOne({ userId: userId });

    if (!vendor) {
      return res.status(404).json({
        message: "No vendor currently associated with this service",
      });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Error fetching vendor by service ID",
    });
  }
};


const getVendorsByServiceId = async (req, res) => {
  const { serviceId } = req.params;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    try {
      const service = await Service.findById(serviceId).lean();
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      if (service.email !== decoded.email) {
        return res.status(403).json({ message: "Access denied: You are not the owner of this service" });
      }

      if (service.vendorEmail) {
        const paidVendor = await Vendor.findOne({ email: service.vendorEmail }).lean();

        if (!paidVendor) {
          return res.status(404).json({ message: "Paid vendor not found" });
        }

        const matchedQuote = paidVendor.quotedServices.find(q => q.serviceId === serviceId);
        return res.status(200).json([
          {
            ...paidVendor,
            quotedPrice: matchedQuote?.price || null,
          },
        ]);
      }

      const vendors = await Vendor.find({
        status: "available",
        quotedServices: { $elemMatch: { serviceId } },
      }).lean();

      const vendorsWithPrice = vendors.map((vendor) => {
        const matchedQuote = vendor.quotedServices.find((q) => q.serviceId === serviceId);
        return {
          ...vendor,
          quotedPrice: matchedQuote?.price || null,
        };
      });

      res.status(200).json(vendorsWithPrice);
    } catch (error) {
      console.error("Error fetching vendors by service ID:", error);
      res.status(400).json({
        error: error.message,
        message: "Error fetching vendors by quoted service ID",
      });
    }
  });
};



const addReview = async (req, res) => {
  const { id } = req.params;
  const { review, reviewer_name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $push: { reviews: { review, reviewer_name } } },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: "No such vendor" });
    }
    
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateReview = async (req, res) => {
  const { vendorId, reviewId } = req.params;
  const { review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, "reviews._id": reviewId },
      { $set: { "reviews.$.review": review } },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteReview = async (req, res) => {
  const { vendorId, reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: "No such vendor" });
    }
    
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getVendorReviews = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such vendor" });
  }

  try {
    const vendor = await Vendor.findById(id).select("reviews");
    
    if (!vendor) {
      return res.status(404).json({ error: "No such vendor" });
    }
    
    res.status(200).json(vendor.reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendor,
  addQuotedService,
  updateVendor,
  deleteVendor,
  getVendorsByService,
  getNearbyVendors,
  getVendorByUserId,
  getVendorsByServiceId,
  addReview,
  updateReview,
  deleteReview,
  getVendorReviews,
  upload,
};
