const express = require("express");
const router = express.Router();
const galleryImageController = require("../controllers/galleryImageController");
const mobGalleryImageController = require("../controllers/mobGalleryImageController");

router.post("/gallery",galleryImageController.upload.single("image"),galleryImageController.createGalleryImage);
router.get("/gallery", galleryImageController.getGalleryImages);
router.put("/gallery/:id",galleryImageController.upload.single("image"),galleryImageController.updateGalleryImage);
router.delete("/gallery/:id", galleryImageController.deleteGalleryImage);
router.post("/mob-gallery",mobGalleryImageController.upload.single("image"),mobGalleryImageController.createGalleryImage);
router.get("/mob-gallery", mobGalleryImageController.getGalleryImages);
router.put("/mob-gallery/:id",mobGalleryImageController.upload.single("image"),mobGalleryImageController.updateGalleryImage);
router.delete("/mob-gallery/:id", mobGalleryImageController.deleteGalleryImage);

module.exports = router;
