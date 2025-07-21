
const GalleryImage = require("../models/galleryImage");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createGalleryImage = async (req, res) => {
  try {
    const { title } = JSON.parse(req.body.formData);
    const image = req.file;
    let URL = null;
    if (image) {
        const base64String = image.buffer.toString('base64');
        URL = `data:${image.mimetype};base64,${base64String}`;
    }
    else {
        return res.status(400).json({ message: "Image is required." });
    }

    const newImage = new GalleryImage({
      title,
      image : URL,
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create gallery image", error });
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch gallery images", error });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const image = req.file;

    let imageUrl;
    if (image) {
      const base64String = image.buffer.toString("base64");
      imageUrl = `data:${image.mimetype};base64,${base64String}`;
    }

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { title, image : imageUrl },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update gallery image", error });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await GalleryImage.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete gallery image", error });
  }
};

module.exports = {
  createGalleryImage,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  upload,
};
