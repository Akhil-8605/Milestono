const jwt = require('jsonwebtoken');
const Article = require('../models/article');
const Advertise = require('../models/adURL');
const Property = require('../models/property');
const Saved = require('../models/saved');
const multer = require('multer');
const User = require('../models/user');
const Project = require('../models/project');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const searchHomePageProperties = async (req, res) => {
    const { latitude, longitude, radius } = req.body;

    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ message: 'Latitude, longitude, and radius are required.' });
    }

    try {
        const token = req.headers.authorization;

        let email = null;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    email = decoded.email;
                }
            });
        }

        const properties = await Property.find({
            featured: true,
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radius / 6378.1]
                }
            }
        });

        const propertiesWithSavedStatus = await Promise.all(properties.map(async (property) => {
            if (email) {
                const isSaved = await Saved.findOne({ email, property_id: property._id });
                return {
                    ...property._doc,
                    saved: !!isSaved
                };
            } else {
                return {
                    ...property._doc,
                    saved: false
                };
            }
        }));

        res.status(200).json(propertiesWithSavedStatus);
    } catch (error) {
        console.error('Error searching homepage properties:', error);
        res.status(500).json({ message: 'Failed to search homepage properties.' });
    }
};


const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ updatedDate: -1 });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ message: 'Failed to fetch articles.' });
    }
};


const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article by id:', error);
        res.status(500).json({ message: 'Failed to fetch article.' });
    }
};


const postArticle = async (req, res) => {
    try {
        const { name, paragraph, seeMore, tags } = req.body;

        const uploadedFiles = req.files;

        const images = {};
        if (uploadedFiles) {
            for (const [key, value] of Object.entries(uploadedFiles)) {
                const file = value[0];
                const base64String = file.buffer.toString('base64');
                images[key] = `data:${file.mimetype};base64,${base64String}`;
            }
        }
        const updatedDate = new Date();

        const newArticle = new Article({
            ...images,
            name,
            paragraph,
            seeMore,
            tags,
            updatedDate
        });

        const savedArticle = await newArticle.save();
        res.status(201).json({ message: 'Article created successfully!', article: savedArticle });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'Failed to create article.' });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedArticle = await Article.findByIdAndDelete(id);
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        res.status(200).json({ message: 'Article deleted successfully!' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Failed to delete article.' });
    }
};

const getAdLink = async (req, res) => {
    try {
        const adData = await Advertise.findOne();
        if (!adData) {
            return res.status(404).json({ message: 'Ad link not found.' });
        }
        res.status(200).json(adData);
    } catch (error) {
        console.error('Error fetching ad link:', error);
        res.status(500).json({ message: 'Failed to fetch ad link.' });
    }
};

const updateAdLink = async (req, res) => {
    try {
        const { ad } = req.body;

        let adData = await Advertise.findOne();

        if (!adData) {
            adData = new Advertise({ ad });
        } else {
            adData.ad = ad;
        }

        const savedAd = await adData.save();
        res.status(200).json({ message: 'Ad link updated successfully!', ad: savedAd });
    } catch (error) {
        console.error('Error updating ad link:', error);
        res.status(500).json({ message: 'Failed to update ad link.' });
    }
};

const getCounts = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const projectsCount = await Project.countDocuments();
        const propertiesCount = await Property.countDocuments();

        res.status(200).json({
            users: usersCount,
            projects: projectsCount,
            properties: propertiesCount
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ message: 'Failed to fetch counts.' });
    }
};

module.exports = {
    searchHomePageProperties,
    getAllArticles,
    getArticleById,
    postArticle,
    deleteArticle,
    getAdLink,
    updateAdLink,
    getCounts,
    upload,
};
