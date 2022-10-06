console.log("hello");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//Database
const mongoose = require('mongoose');
const password = "Kef5HvBPxemo15UY"
const uri = `mongodb+srv://Julien:${password}@cluster0.pd8usul.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri).then((()=> console.log("Connected to Mongo !"))).catch(err => console.error ("Error connecting to Mongo: ", err ))


const userSchema = new mongoose.Schema({
    name: String,
    password: String
})

const User = mongoose.model("User",userSchema)
const julien = new User({name: "julien", password: "pouet"})
julien.save().then(res=> console.log("julien enregisté", res)).catch(err => console.log("julien pas enregistré", err))
console.log("julien ", julien);
//Middleware
app.use(cors());
app.use(express.json())

//Routes
app.post("/api/auth/signup", (req, res) => {
  console.log("signup request", req.body);
  res.send({message: "Utilisateur enregistré"})
});
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () => {
  console.log("listening on port " + port);
});
