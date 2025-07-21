const Service = require("../models/serviceModel");
const Vendor = require("../models/vendorModel");
const User = require('../models/user');
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createService = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      
      const {
        name,
        description,
        category,
        landmark,
        address,
        coordinates,
        status,
        price,
        otp,
      } = JSON.parse(req.body.formData);

      if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Name is required." });
      }
      
      if (!description || description.trim() === "") {
        return res.status(400).json({ message: "Description is required." });
      }
      
      if (!category || category.trim() === "") {
        return res.status(400).json({ message: "Category is required." });
      }
      
      if (!landmark || landmark.trim() === "") {
        return res.status(400).json({ message: "Landmark is required." });
      }

      const serviceImage = req.file;

      let image = null;
      if (serviceImage) {
        const base64String = serviceImage.buffer.toString("base64");
        image = `data:${serviceImage.mimetype};base64,${base64String}`;
      } else {
        return res.status(400).json({ message: "Image is required." });
      }

      const serviceData = {
        name,
        description,
        category,
        landmark,
        address,
        coordinates,
        status,
        price,
        otp,
        image,
        email: decoded.email,
      };

      const service = await Service.create(serviceData);
      res.status(201).json({ serviceId: service._id });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service", error });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such service" });
  }

  try {
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ error: "No such service" });
    }

    if (service.vendorEmail) {
      const user = await User.findOne({ email: service.vendorEmail }).lean();
      if (user && user.phone) {
        service.vendorPhone = user.phone;
      }
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such service" });
  }

  try {
    const service = await Service.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ error: "No such service" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such service" });
  }

  try {
    const service = await Service.findOneAndDelete({ _id: id });
    if (!service) {
      return res.status(404).json({ error: "No such service" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const services = await Service.find({ category });
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getServicesByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const services = await Service.find({ status });
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getServicesByCustomerId = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const services = await Service.find({ email });

    const servicesWithVendorPhone = await Promise.all(
      services.map(async (service) => {
        if (service.vendorEmail) {
          const vendorUser = await User.findOne({ email: service.vendorEmail });
          return {
            ...service.toObject(),
            vendorPhone: vendorUser?.phone || null,
          };
        }
        return { ...service.toObject(), vendorPhone: null };
      })
    );

    res.status(200).json(servicesWithVendorPhone);
  } catch (error) {
    console.error("Error fetching services by token:", error.message);
    res.status(400).json({ error: "Invalid token or request" });
  }
};


const getServicesByVendorId = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const services = await Service.find({ vendorEmail: email }).sort({ createdAt: -1 });

    const enrichedServices = await Promise.all(
      services.map(async (service) => {
        const customer = await User.findOne({ email: service.email });
        return {
          ...service.toObject(),
          customerPhone: customer?.phone || null,
        };
      })
    );

    res.status(200).json(enrichedServices);
  } catch (error) {
    console.error("Error fetching services for vendor:", error.message);
    res.status(400).json({ error: "Invalid token or request" });
  }
};

const getNearbyServices = async (req, res) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query;

  try {
    const services = await Service.find({
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
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNearbyServicesByCategory = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const { longitude, latitude, maxDistance = 10000 } = req.body;

    if (!longitude || !latitude ) {
      return res.status(400).json({
        error: "longitude, latitude are required parameters",
      });
    }

    try {
      const vendor = await Vendor.findOne({ email: decoded.email }).lean();

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const rawServices = await Service.find({
        category : vendor.serviceCategory,
        status: { $in: ["requested","quoted", "paid"] },
        coordinates: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseInt(maxDistance),
          },
        },
      }).lean();

      const paidService = rawServices.find(
        (service) => service.status === "paid" && service.vendorEmail === decoded.email
      );

      const servicesToReturn = paidService
        ? [paidService]
        : rawServices.filter((s) => s.status === "requested" || s.status === "quoted");

      const quotedMap = {};
      vendor.quotedServices?.forEach((qs) => {
        quotedMap[qs.serviceId] = qs.price;
      });

      const servicesWithPrices = await Promise.all(
        servicesToReturn.map(async (service) => {
          let servicePhone = null;

          if (service.status === "paid" && service.email) {
            const user = await User.findOne({ email: service.email }).lean();
            if (user?.phone) {
              servicePhone = user.phone;
            }
          }

          return {
            ...service,
            quotedPrice: quotedMap[service._id.toString()] || null,
            servicePhone,
          };
        })
      );

      res.status(200).json(servicesWithPrices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(400).json({ error: error.message });
    }
  });
};

const verifyServiceOTP = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }

    const { serviceId, otp } = req.body;

    if (!serviceId || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Service ID and OTP are required" });
    }

    try {
      const service = await Service.findById(serviceId);

      if (!service) {
        return res
          .status(404)
          .json({ success: false, message: "Service not found" });
      }

      if (service.otp !== otp) {
        return res.status(200).json({ success: false, message: "Invalid OTP" });
      }

      service.status = "completed";
      await service.save();

      const vendor = await Vendor.findOne({ email: decoded.email });

      if (vendor) {
        vendor.status = "available";
        await vendor.save();
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Service completed and vendor available",
        });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ success: false, message: "Server error", error });
    }
  });
};

const markServiceAsPaid = async (req, res) => {
  
  const notificationSocket = req.app.get("notificationSocket");
  const { id } = req.params;
  const { price, vendorId } = req.body;

  if (!price || !vendorId) {
    return res
      .status(400)
      .json({ message: "Price and vendorId are required." });
  }

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor || vendor.status==="busy") {
      return res.status(404).json({ message: "Vendor is Busy." });
    }

    const otp = crypto.randomBytes(3).toString("hex").toUpperCase();

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        price,
        vendorEmail: vendor.email,
        status: "paid",
        otp,
      },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    vendor.status = "busy";
    await vendor.save();

    await notificationSocket.sendNotificationToUser({
      email: updatedService.email,
      data: {
        email: updatedService.email,
        text: `Payment confirmed! OTP: ${otp}. Track your service.`,
        image: vendor.vendorImage, 
        redirect: `${process.env.FRONT_END_URL}/servicemans/${updatedService._id}`,
      },
    });

    await notificationSocket.sendNotificationToUser({
      email: vendor.email,
      data: {
        email: vendor.email,
        text: `Your quote was accepted! Service confirmed.`,
        image: updatedService.image, 
        redirect: `${process.env.FRONT_END_URL}/receivedservicerequests`,
      },
    });


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
      to: updatedService.email,
      subject: "Milestono Payment Confirmation & OTP",
      text: `Dear User,\n\nYour payment for the service request has been successfully confirmed.\n\n🔒 IMPORTANT: Do not share this OTP until your work is completed. Only provide it to the vendor after the service is done.\n\n✅ Your OTP: ${otp}\n\n📍 You can track your service status and assigned vendor here:\n${process.env.FRONT_END_URL}/servicemans/${updatedService._id}\n\nIf you have any concerns, feel free to contact us.\n\nBest regards,\nMilestono.com Support Team`
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to send OTP email.", error: error.message });
      }
      res.status(200).json({
        message: "Service request status updated to Paid and OTP sent.",
        serviceRequest: updatedServiceRequest,
      });
    });

    const mailOptions1 = {
      from: `"Milestono Support" <${process.env.EMAIL_USERNAME}>`,
      to: vendor.email,
      subject: "Quotation Accepted – Service Request Confirmed on Milestono",
      text: `Dear ${vendor.name || "Vendor"},\n\nYour quoted price has been accepted by the user. The service request is now confirmed, and payment has been successfully made.\n\n🔒 IMPORTANT: Please complete the service properly before asking the user for the OTP.\n\n📍 To track this service request and manage your tasks, visit:\n${process.env.FRONT_END_URL}/receivedservicerequests\n\nIf you have any questions or issues, feel free to reach out to us at support@milestono.com.\n\nThank you for being a valued service provider!\n\nBest regards,\nMilestono Support Team`
    };

    transporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to send OTP email.", error: error.message });
      }
      res.status(200).json({
        message: "Service request status updated to Paid and OTP sent.",
        serviceRequest: updatedServiceRequest,
      });
    });

    res.status(200).json({
      message: "Service marked as paid and vendor marked as busy.",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error marking service as paid:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const calculateDistance = async (req, res) => {
  const { id } = req.params;
  const { emailFromBody } = req.body;
  try {
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const vendorEmail = service.vendorEmail || emailFromBody;

    if (!vendorEmail) {
      return res.status(400).json({ message: "Vendor email not found in service or request body" });
    }

    const vendor = await Vendor.findOne({ email: vendorEmail }).lean();

    if (!vendor || !vendor.coordinates || !service.coordinates) {
      return res.status(404).json({ message: "Vendor or service location not available" });
    }

    const toRad = (value) => (value * Math.PI) / 180;

    const [lng1, lat1] = vendor.coordinates;
    const [lng2, lat2] = service.coordinates;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    res.status(200).json({
      distanceInKm: Number(distance.toFixed(2)),
    });
  } catch (error) {
    console.error("Error calculating distance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServicesByStatus,
  getServicesByCustomerId,
  getServicesByVendorId,
  getNearbyServices,
  getNearbyServicesByCategory,
  verifyServiceOTP,
  markServiceAsPaid,
  calculateDistance,
  upload,
};
