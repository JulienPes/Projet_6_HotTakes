const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const checkSauceInput = require("../middleware/check-sauce-input")

const sauceCtrl = require("../controllers/sauce");

router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);

module.exports = router;
