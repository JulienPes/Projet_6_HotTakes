//Librairie qui fournit un ensemble de méthodes permettant de traiter les requêtes HTTP et fournissant un système de middleware.
const express = require("express");
// Création et géstion de rotes modulaires
const router = express.Router()
// Require du controller user
const userCtrl = require("../controllers/user");
// Require du middleware de checkPassword
const checkPassword = require("../middleware/check-password")
// Require du middleware de checkEmail
const checkEmail = require("../middleware/check-email")
// Route signup
router.post("/signup", checkEmail, checkPassword, userCtrl.signup);
// Route login
router.post("/login", userCtrl.login);

module.exports = router;