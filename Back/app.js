// Librairie qui fournit un ensemble de méthodes permettant de traiter les requêtes HTTP et fournissant un système de middleware.
const express = require("express");
// mongoose = "odm" object data model
const mongoose = require("mongoose");
// Protègege contre diverses attaques : XSS, CSRF etc...
const helmet = require("helmet");
// Module de géstion des chemins
const path = require("path");
// .env permet de gérer un projet multi-environnement au travers de fichiers
require("dotenv").config();
// Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const mongoSanitize = require("express-mongo-sanitize");
// .env
const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USER;
// Liens de connexion base de données
const uri = `mongodb+srv://${userName}:${password}@cluster0.vepygbr.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  // Méthode de connexion à mongo
  .connect(uri)
  // Async si tout ok log Connected to Mongo
  .then(() => console.log("Connected to Mongo !"))
  // Si erreur log Error connecting to Mongo + err
  .catch((err) => console.error("Error connecting to Mongo: ", err));

const app = express();

// Méthode de configuration headers express
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Méthode express
app.use(
  // Contre les attaques par injection de sélecteur de requête
  mongoSanitize({
    replaceWith: "_",
  })
);
// Analyse les requêtes entrantes avec des charges utiles JSON
app.use(express.json());
// Le chemin est dans le dossier ayant le nom (__dirname) "images" du disque
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use(helmet());

module.exports = app;
