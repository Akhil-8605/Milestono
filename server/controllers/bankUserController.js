const BankUser = require("../models/bankUser");

const createBankUser = async (req, res) => {
  try {
    const { 
      propertyIdentified,
      propertyCity,
      propertyCost,
      employmentType,
      income,
      currentEmi,
      loanAmount,
      tenure,
      age,
      fullName,
      email,
      mobile,
      acceptTerms,
    } = req.body;

    if (!acceptTerms) {
      return res.status(400).json({ message: "You must accept the terms and conditions." });
    }

    const newUser = new BankUser({
      propertyIdentified,
      propertyCity,
      propertyCost,
      employmentType,
      income,
      currentEmi,
      fullName,
      email,
      mobile,
      loanAmount,
      tenure,
      age,
      acceptTerms,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

const getBankUsers = async (req, res) => {
  try {
    const users = await BankUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

module.exports = {
  createBankUser,
  getBankUsers,
};
