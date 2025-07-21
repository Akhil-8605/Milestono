const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Saved = require('../models/saved');
const Viewed = require('../models/viewed');
const RecentViewed = require('../models/recentViewed');

const markAsSaved = async (req, res) => {
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

            const existingViewed = await Saved.findOne({ email, property_id });
            if (existingViewed) {
                return res.status(400).json({ message: 'Property already marked as viewed.' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const viewed = new Saved({ email, property_id });
            await viewed.save();

            res.status(201).json({ message: 'Property marked as saved.' });
        });
    } catch (error) {
        console.error('Error marking property as saved:', error);
        res.status(500).json({ message: 'Failed to mark property as saved.' });
    }
};

const unSaveProperty = async (req, res) => {
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

            const saved = await Saved.findOneAndDelete({ email, property_id });
            if (!saved) {
                return res.status(404).json({ message: 'Property not found in saved list.' });
            }

            res.status(200).json({ message: 'Property removed from saved list.' });
        });
    } catch (error) {
        console.error('Error removing property from saved list:', error);
        res.status(500).json({ message: 'Failed to remove property from saved list.' });
    }
};

const getSavedProperties = async (req, res) => {
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
  
        const savedProperties = await Saved.find({ email })
          .populate({
            path: 'property_id',
            match: {},
          })
          .exec();
  
        const validProperties = savedProperties
          .filter(viewed => viewed.property_id !== null)
          .map(viewed => viewed.property_id);
  
        if (validProperties.length === 0) {
          return res.status(404).json({ message: 'No saved properties found for this user.' });
        }
  
        res.status(200).json(validProperties);
      });
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      res.status(500).json({ message: 'Failed to fetch saved properties.' });
    }
  };
  

const checkSavedStatus = async (req, res) => {
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

            const viewed = await Saved.findOne({ email, property_id });
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


const markAsViewed = async (req, res) => {
    try {
        const token = req.headers.authorization;
        let email = 'anonymous@milestono.com';

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                email = decoded.email || email;
            } catch (err) {
                console.warn('Invalid token. Proceeding as anonymous user.');
            }
        }

        const { property_id } = req.body;

        if (email !== 'anonymous@milestono.com') {
            await Viewed.deleteOne({ email, property_id });
            const user = await User.findOne({ email });
            if (!user) {
                email = 'anonymous@milestono.com';
            }
        }

        const viewed = new Viewed({ email, property_id });
        await viewed.save();

        res.status(201).json({ message: 'Property marked as viewed.' });

    } catch (error) {
        console.error('Error marking property as viewed:', error);
        res.status(500).json({ message: 'Failed to mark property as viewed.' });
    }
};

const getLastViewedProperties = async (req, res) => {
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
            const userRecentViewed = await Viewed.find({ email })
                .populate({
                    path: 'property_id', 
                    match: {}, 
                })
                .sort({ createdAt: -1 }) 
                .limit(10)
                .exec();

            if (!userRecentViewed || userRecentViewed.length === 0) {
                return res.status(404).json({ message: 'No recent viewed properties found.' });
            }

            const validProperties = userRecentViewed.map(viewed => viewed.property_id).filter(property => property !== null);

            if (validProperties.length === 0) {
                return res.status(404).json({ message: 'No recent viewed properties found.' });
            }

            res.status(200).json(validProperties);
        });
    } catch (error) {
        console.error('Error fetching recent viewed properties:', error);
        res.status(500).json({ message: 'Failed to fetch recent viewed properties.' });
    }
};

module.exports = {
    markAsSaved,
    unSaveProperty,
    checkSavedStatus,
    getSavedProperties,
    markAsViewed,
    getLastViewedProperties,
  };
  