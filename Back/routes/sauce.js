// Librairie qui fournit un ensemble de méthodes permettant de traiter les requêtes HTTP et fournissant un système de middleware.
const express = require("express");
// Création et géstion de rotes modulaires
const router = express.Router();
// Require du middleware de config chemin
const multer = require("../middleware/multer-config");
// Require du middleware d'authentification
const auth = require("../middleware/auth");
// Require du controller sauce
const sauceCtrl = require("../controllers/sauce");

// Routes
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce)
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
