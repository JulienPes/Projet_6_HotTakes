// Object database Modeling 
const mongoose = require("mongoose");
// Améliore les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require("mongoose-unique-validator");
// Package npm permettant de limiter la demande de l'utilisateur
const rateLimit = require("express-rate-limit")
// Plugin qui intercepte les erreurs de mongoose pour en faire des erreurs http 
const mongooseErrors = require("mongoose-errors")

const limiter = rateLimit({
  widowMs: 3 * 60 * 1000, // 3 minutes
  max: 3, // Limite chaque IP à 3 requête par widowMs
  message: "Trop de requête abusive, veuillez attendre 3 minutes !"
})
// Création du userSchema de création d'un user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Appel du plugin uniqueValidator
userSchema.plugin(uniqueValidator);
// Appel du plugin mongooseErrors
userSchema.plugin(mongooseErrors);


module.exports = mongoose.model("User", userSchema);
