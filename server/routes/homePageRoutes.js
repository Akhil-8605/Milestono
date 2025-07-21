const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/homePageController');

router.post('/home-properties', homePageController.searchHomePageProperties);
router.get('/articles', homePageController.getAllArticles);
router.get('/articles/:id', homePageController.getArticleById);
router.post('/articles', homePageController.upload.fields([
    { name: 'imageSrc', maxCount: 1 }, 
]), homePageController.postArticle);
router.delete('/articles/:id', homePageController.deleteArticle);
router.get('/advertise', homePageController.getAdLink);
router.put('/advertise', homePageController.updateAdLink);
router.get('/home-count', homePageController.getCounts);

module.exports = router;
