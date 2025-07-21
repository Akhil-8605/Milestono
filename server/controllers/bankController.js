const Bank = require("../models/bank");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createBank = async (req, res) => {
  try {
    const { bankName, interestRate, processingFees, emi, maxLoanAmount, featured } = JSON.parse(req.body.formData);
    const bankImage = req.file;

    let image = null;
    if (bankImage) {
      const base64String = bankImage.buffer.toString("base64");
      image = `data:${bankImage.mimetype};base64,${base64String}`;
    }
    else {
        return res.status(400).json({ message: "Image is required." });
    }

    const newBank = new Bank({
      bankName,
      bankImage: image,
      interestRate,
      processingFees,
      emi,
      maxLoanAmount,
      featured,
    });

    const savedBank = await newBank.save();
    res.status(201).json(savedBank);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create bank", error });
  }
};

const getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banks", error });
  }
};

const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { bankName, interestRate, processingFees, emi, maxLoanAmount, featured } = JSON.parse(req.body.formData);
    const bankImage = req.file;

    let image = null;
    if (bankImage) {
      const base64String = bankImage.buffer.toString("base64");
      image = `data:${bankImage.mimetype};base64,${base64String}`;
    }

    const updatedBank = await Bank.findByIdAndUpdate(
      id,
      {
        bankName,
        bankImage: image || undefined,
        interestRate,
        processingFees,
        emi,
        maxLoanAmount,
        featured,
      },
      { new: true } 
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(updatedBank);
  } catch (error) {
    res.status(500).json({ message: "Failed to update bank", error });
  }
};

const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBank = await Bank.findByIdAndDelete(id);

    if (!deletedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json({ message: "Bank deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bank", error });
  }
};

module.exports = {
  createBank,
  getBanks,
  updateBank,
  deleteBank,
  upload,
};
