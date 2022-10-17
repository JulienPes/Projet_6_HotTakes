const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const checkSauceInput = require("../middleware/check-sauce-input");

const sauceCtrl = require("../controllers/sauce");

router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, checkSauceInput, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce)
router.put("/:id", auth, multer, checkSauceInput, sauceCtrl.updateSauce);

module.exports = router;
