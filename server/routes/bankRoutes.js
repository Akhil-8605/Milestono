const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankController");
const bankUserController = require("../controllers/bankUserController");

router.post("/bank", bankController.upload.single("bankImage"), bankController.createBank);
router.get("/bank", bankController.getBanks);
router.put("/bank/:id", bankController.upload.single("bankImage"), bankController.updateBank);
router.delete("/bank/:id", bankController.deleteBank);
router.post("/bank-users", bankUserController.createBankUser);
router.get("/bank-users", bankUserController.getBankUsers);

module.exports = router;
