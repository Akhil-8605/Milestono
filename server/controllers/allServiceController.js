const Vendor = require("../models/vendorModel");
const ServiceRequest = require('../models/serviceModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const createServiceman = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const {
                vendorName,         
                adharNumber,        
                panNumber,          
                serviceRoll,
                vendorDescription,
                experience,
                district,
                state,
                subDistrict,
                serviceCategory,
                address,
                accountNo,
                ifsccode,
            } = req.body;

            const uploadedFiles = req.files;

            const images = {};
            if (uploadedFiles) {
                for (const [key, value] of Object.entries(uploadedFiles)) {
                    const file = value[0];
                    const base64String = file.buffer.toString('base64');
                    images[key] = `data:${file.mimetype};base64,${base64String}`;
                }
            }

            const status = "pending";
            const existingServiceman = await Vendor.findOne({ email: decoded.email });
            if (existingServiceman) {
                return res.status(400).json({ error: 'A serviceman with this email already exists' });
            }

            const newServiceman = new Vendor({
                ...images,
                vendorName,         
                adharNumber,        
                panNumber,          
                serviceRoll,
                vendorDescription,
                experience,
                district,
                state,
                subDistrict,
                serviceCategory,
                address,
                status,
                accountNo,
                ifsccode,
                email: decoded.email,
            });

            try {
                const savedServiceman = await newServiceman.save();
                res.status(201).json(savedServiceman);
            } catch (saveError) {
                res.status(500).json({ error: 'Error saving serviceman: ' + saveError.message });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

const createProblem = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const {
                address,
                name,
                problemDescription,
                problemType,
                serviceCategory
            } = req.body;

            const uploadedPhoto = req.file;

            let base64Image = null;
            if (uploadedPhoto) {
                base64Image = `data:${uploadedPhoto.mimetype};base64,${uploadedPhoto.buffer.toString('base64')}`;
            }

            const status = "pending";

            const newServiceRequest = new ServiceRequest({
                address,
                name,
                problemDescription,
                problemImage: base64Image,
                problemType,
                status,
                serviceCategory,
                email: decoded.email,
            });

            try {
                const savedServiceRequest = await newServiceRequest.save();
                res.status(201).json(savedServiceRequest);
            } catch (saveError) {
                res.status(500).json({ error: 'Error saving service request: ' + saveError.message });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};


const getAllServiceman = async (req, res) => {
    try {
        const service = await Vendor.find();

        if (!service) {
            res.status(404).json({ message: 'No Service mans found.' });
            return;
        }

        res.status(200).json(service);
    } catch (error) {
        console.error('Error fetching Service man details:', error);
        res.status(500).json({ message: 'Failed to fetch Service man details.' });
    }
};

const getAllProblems = async (req, res) => {
    try {
        const service = await ServiceRequest.find();

        if (!service) {
            res.status(404).json({ message: 'No Service Request found.' });
            return;
        }

        res.status(200).json(service);
    } catch (error) {
        console.error('Error fetching Service Request details:', error);
        res.status(500).json({ message: 'Failed to fetch Service Request details.' });
    }
};

const getPayToProblems = async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find({
            status: { $in: ['completed', 'paid', 'done'] }
        });

        if (!serviceRequests) {
            return res.status(404).json({ message: 'No Service Requests found with the specified statuses.' });
        }

        const servicemanEmails = serviceRequests.map(request => request.vendorEmail);
        const servicemen = await Vendor.find({ email: { $in: servicemanEmails } });

        const serviceRequestsWithServiceman = serviceRequests.map(request => {
            const serviceman = servicemen.find(man => man.email === request.vendorEmail);
            return {
                ...request.toObject(), 
                serviceman: serviceman || null 
            };
        });

        res.status(200).json(serviceRequestsWithServiceman);
    } catch (error) {
        console.error('Error fetching Service Request details:', error);
        res.status(500).json({ message: 'Failed to fetch Service Request details.' });
    }
};


const getUserAllProblems = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const problems = await ServiceRequest.find({ email: decoded.email });

            if (!problems) {
                return res.status(404).json({ message: 'No service requests found for this email.' });
            }

            res.status(200).json(problems);
        });
    } catch (error) {
        console.error('Error fetching service requests:', error);
        res.status(500).json({ message: 'Failed to fetch service requests.' });
    }
};

const getVendorsAllProblems = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const problems = await ServiceRequest.find({ vendorEmail: decoded.email });

            if (!problems) {
                return res.status(404).json({ message: 'No service requests found for this email.' });
            }

            res.status(200).json(problems);
        });
    } catch (error) {
        console.error('Error fetching service requests:', error);
        res.status(500).json({ message: 'Failed to fetch service requests.' });
    }
};


const venderServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;
        const email = req.body.email;
        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "vendorReview", vendorEmail: email },
            { new: true }
        );


        if (!updatedserviceRequest) {
            return res.status(404).json({ message: 'serviceRequest not found.' });
        }

        res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
    } catch (error) {
        console.error('Error updating serviceRequest details:', error);
        res.status(500).json({ message: 'Failed to update serviceRequest details.' });
    }
};

const adminServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;
        const expectedPrice = req.body.expectedPrice;


        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "adminReview", expectedPrice },
            { new: true }
        );


        if (!updatedserviceRequest) {
            return res.status(404).json({ message: 'serviceRequest not found.' });
        }

        res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
    } catch (error) {
        console.error('Error updating serviceRequest details:', error);
        res.status(500).json({ message: 'Failed to update serviceRequest details.' });
    }
};

const pendingServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;


        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "pending", vendorEmail: "" },
            { new: true }
        );


        if (!updatedserviceRequest) {
            return res.status(404).json({ message: 'serviceRequest not found.' });
        }

        res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
    } catch (error) {
        console.error('Error updating serviceRequest details:', error);
        res.status(500).json({ message: 'Failed to update serviceRequest details.' });
    }
};

const acceptServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;


        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "accepted" },
            { new: true }
        );


        if (!updatedserviceRequest) {
            return res.status(404).json({ message: 'serviceRequest not found.' });
        }

        res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
    } catch (error) {
        console.error('Error updating serviceRequest details:', error);
        res.status(500).json({ message: 'Failed to update serviceRequest details.' });
    }
};

const doneServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;


        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedserviceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "done" },
            { new: true }
        );


        if (!updatedserviceRequest) {
            return res.status(404).json({ message: 'serviceRequest not found.' });
        }

        res.status(200).json({ message: 'serviceRequest details updated successfully.', serviceRequest: updatedserviceRequest });
    } catch (error) {
        console.error('Error updating serviceRequest details:', error);
        res.status(500).json({ message: 'Failed to update serviceRequest details.' });
    }
};

const updateServiceRequestToPaid = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;

        if (!serviceRequestId) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        const otp = crypto.randomBytes(3).toString("hex").toUpperCase();

        const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: "paid", otp },
            { new: true }
        );

        if (!updatedServiceRequest) {
            return res.status(404).json({ message: "Service Request not found." });
        }

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
            to: updatedServiceRequest.email,
            subject: "Milestono Payment Confirmation & OTP",
            text: `Dear User,\n\nYour payment for the service request has been successfully confirmed.\n\n🔒 **Important:** Do not share this OTP until your work is completed. Only provide it to the vendor **after** the service is done.\n\n✅ **Your OTP:** ${otp}\n\nIf you have any concerns, feel free to contact us.\n\nBest regards,\nMilestono.com Support Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Failed to send OTP email.", error: error.message });
            }
            res.status(200).json({
                message: "Service request status updated to Paid and OTP sent.",
                serviceRequest: updatedServiceRequest,
            });
        });
    } catch (error) {
        console.error("Error updating service request details:", error);
        res.status(500).json({ message: "Failed to update service request details." });
    }
};

const verifyServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;
        const { otp } = req.body;

        if (!serviceRequestId || !otp) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const serviceRequest = await ServiceRequest.findOne({ _id: serviceRequestId, otp });

        if (!serviceRequest) {
            return res.status(404).json({ message: 'ServiceRequest not found or invalid OTP.' });
        }

        const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            { status: 'verified' },
            { new: true }
        );

        res.status(200).json({ message: 'ServiceRequest verified successfully.', serviceRequest: updatedServiceRequest });
    } catch (error) {
        console.error('Error verifying service request:', error);
        res.status(500).json({ message: 'Failed to verify service request.' });
    }
};

const acceptServiceman = async (req, res) => {
    try {
        const servicemanId = req.params.id;


        if (!servicemanId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const updatedServiceman = await Vendor.findByIdAndUpdate(
            servicemanId,
            { status: "accepted" },
            { new: true }
        );


        if (!updatedServiceman) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        res.status(200).json({ message: 'Vendor details updated successfully.', serviceman: updatedServiceman });
    } catch (error) {
        console.error('Error updating serviceman details:', error);
        res.status(500).json({ message: 'Failed to update serviceman details.' });
    }
};


const deleteServiceRequest = async (req, res) => {
    try {
        const serviceRequestId = req.params.id;

        if (!serviceRequestId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const deletedServiceRequest = await ServiceRequest.findByIdAndDelete(serviceRequestId);

        if (!deletedServiceRequest) {
            return res.status(404).json({ message: 'ServiceRequest not found.' });
        }

        res.status(200).json({ message: 'ServiceRequest deleted successfully.', deletedServiceRequest });
    } catch (error) {
        console.error('Error deleting serviceRequest:', error);
        res.status(500).json({ message: 'Failed to delete serviceRequest.' });
    }
};

const deleteServiceman = async (req, res) => {
    try {
        const servicemanId = req.params.id;

        if (!servicemanId) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const deletedServiceman = await Vendor.findByIdAndDelete(servicemanId);

        if (!deletedServiceman) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        res.status(200).json({ message: 'Vendor deleted successfully.', deletedServiceman });
    } catch (error) {
        console.error('Error deleting serviceman:', error);
        res.status(500).json({ message: 'Failed to delete serviceman.' });
    }
};

const getServicemanDetails = (req, res) => {
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
  
      Vendor.findOne({ email: decoded.email })
        .then(existingServiceman => {
          if (existingServiceman) {
            return res.json(existingServiceman);
          } else {
            return res.status(404).json({ error: 'Vendor not found' });
          }
        })
        .catch(err => {
          console.error('Error finding user', err);
          res.status(500).json({ error: 'Internal server error' });
        });
    });
  };

  const updateServiceProfile = (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      Vendor.findOneAndUpdate({ email: decoded.email }, req.body, { new: true })
        .then(updatedServiceman => {
          res.json(updatedServiceman);
        })
        .catch(err => {
          console.error('Error updating user profile', err);
          res.status(500).json({ error: 'Internal server error' });
        });
    });
  };

module.exports = {
    createServiceman,
    getAllServiceman,
    acceptServiceman,
    deleteServiceman,
    createProblem,
    getAllProblems,
    getPayToProblems,
    getUserAllProblems,
    getVendorsAllProblems,
    adminServiceRequest,
    venderServiceRequest,
    pendingServiceRequest,
    acceptServiceRequest,
    doneServiceRequest,
    deleteServiceRequest,
    upload,
    updateServiceRequestToPaid,
    verifyServiceRequest,
    getServicemanDetails,
    updateServiceProfile,
};