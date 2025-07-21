const jwt = require('jsonwebtoken');
const multer = require('multer');
const Property = require('../models/property');
const User = require('../models/user');
const Account = require('../models/account')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addPropertyDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const formData = JSON.parse(req.body.formData);
            const uploadedPhotos = req.files;

            let base64images = [];
            if (uploadedPhotos) {
                for (let i = 0; i < uploadedPhotos.length; i++) {
                    const photo = uploadedPhotos[i];
                    const base64String = photo.buffer.toString('base64');
                    base64images.push(`data:${photo.mimetype};base64,${base64String}`);
                }
            }

            const user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const account = await Account.findOne({
              email : decoded.email,
              premiumStartDate: { $lte: new Date() },  
              premiumEndDate: { $gte: new Date() }  
            });


            if (account && account.numOfProperties === -1) {
              account.numOfProperties = -1
            } else if (account && account.numOfProperties > 0) {
                account.numOfProperties -= 1;
            } else if (user.numOfProperties > 0) {
                user.numOfProperties -= 1;
            } else {
                return res.status(403).json({ error: 'Maximum number of properties reached. Please upgrade your account.' });
            }
            await account && account.save(); 
            await user.save();

            const newProperty = new Property({
                heading: formData.heading,
                deposite: formData.deposite,
                pricePerMonth: formData.pricePerMonth,
                sellType: formData.sellType,
                sellerType: formData.sellerType,
                propertyCategory: formData.propertyCategory,
                oldProperty: formData.oldProperty,
                propertyContains: formData.propertyContains,
                amenities: formData.amenities,
                furnitures: formData.furnitures,
                email: decoded.email,
                city: formData.city,
                landmark: formData.landmark,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                balconies: formData.balconies,
                ownership: formData.ownership,
                expectedPrice: formData.expectedPrice,
                pricePerSqFt: formData.pricePerSqFt,
                isAllInclusive: formData.isAllInclusive,
                isPriceNegotiable: formData.isPriceNegotiable,
                isTaxchargeExc: formData.isTaxchargeExc,
                uniqueFeatures: formData.uniqueFeatures,
                areaSqft: formData.areaSqft,
                latitude: formData.latitude,
                reservedParking:formData.reservedParking,
                selectedFurnishing:formData.selectedFurnishing,
                selectedRoom:formData.selectedRoom,
                longitude: formData.longitude,
                bulkCount: formData.bulkCount ? formData.bulkCount : 1,
                location: {
                    type: 'Point',
                    coordinates: [formData.longitude, formData.latitude]
                },
                uploadedPhotos: base64images
            });

            try {
                const savedProperty = await newProperty.save();
                res.status(201).json({ message: 'Property details added successfully!', key: savedProperty._id });
            } catch (saveError) {
                console.error('Error saving property details:', saveError);
                res.status(500).json({ message: 'Failed to add property details.' });
            }
        });
    } catch (error) {
        console.error('Error adding property details:', error);
        res.status(500).json({ message: 'Failed to add property details.' });
    }
};


const deletePropertyDetails = async (req, res) => {
    try {
      const propertyId = req.params.id;
  
      if (!propertyId) {
        return res.status(400).json({ message: 'Missing required parameters.' });
      }
  
      const deletedProperty = await Property.findByIdAndDelete(propertyId);
  
      if (!deletedProperty) {
        return res.status(404).json({ message: 'Property not found.' });
      }
  
      res.status(200).json({ message: 'Property deleted successfully.', deletedProperty });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ message: 'Failed to delete property.' });
    }
  };

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();

        if (!properties ) {
            res.status(404).json({ message: 'No properties found.' });
            return;
        }

        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ message: 'Failed to fetch property details.' });
    }
};

const searchProperties = async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ message: "Latitude, longitude, and radius are required." });
  }

  try {
    const properties = await Property.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1],
        },
      },
    });

    const sortedProperties = properties.sort((a, b) => {
      return (b.featured === true) - (a.featured === true);
    });

    res.status(200).json(sortedProperties);
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ message: "Failed to search properties." });
  }
};


const markPropertyAsFeatured = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const propertyId = req.params.id;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded.email) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const email = decoded.email;
      const account = await Account.findOne({
        email,
        premiumStartDate: { $lte: new Date() },
        premiumEndDate: { $gte: new Date() }
      });

      if (!account) {
        return res.status(403).json({ error: 'Premium account not found or expired' });
      }

      const existingProperty = await Property.findById(propertyId);

      if (!existingProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (existingProperty.featured === true) {
        return res.status(200).json({ status: true, message: 'Property is already featured.' });
      }

      if (account.numOfFeaturedProperties <= 0) {
        return res.status(403).json({ error: 'No featured properties left in your plan' });
      }

      existingProperty.featured = true;
      await existingProperty.save();

      account.numOfFeaturedProperties -= 1;
      await account.save();

      res.status(200).json({ status: true, message: 'Property marked as featured.' });
    });

  } catch (error) {
    console.error("Error marking property as featured:", error);
    res.status(500).json({ error: 'Failed to mark property as featured' });
  }
};


const updateUserHomePage = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { featured } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required.' });
    }
    if (typeof featured !== 'boolean') {
      return res.status(400).json({ message: 'Invalid value for featured.' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: { featured } },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    res.status(200).json({
      message: 'Property updated successfully.',
      updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Failed to update property.' });
  }
};

const getUserProperties = async (req, res) => {
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
      const properties = await Property.find({ email });

      if (!properties ) {
        return res.status(404).json({ message: 'No properties found for this user.' });
      }

      return res.status(200).json({ properties });
    });
  } catch (error) {
    console.error('Error retrieving user properties:', error);
    return res.status(500).json({ message: 'Failed to retrieve user properties.' });
  }
};

module.exports = {
    addPropertyDetails,
    getAllProperties,
    searchProperties,
    deletePropertyDetails,
    updateUserHomePage,
    getUserProperties,
    markPropertyAsFeatured,
    upload,
};
