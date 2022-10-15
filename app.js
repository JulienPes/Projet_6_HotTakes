const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();

const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce');


const password = process.env.DB_PASSWORD;
const userName = process.env.DB_USER
const uri = `mongodb+srv://${userName}:${password}@cluster0.vepygbr.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo !"))
  .catch((err) => console.error("Error connecting to Mongo: ", err));


const app = express();


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

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes)
 
module.exports = app;