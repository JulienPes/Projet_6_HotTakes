require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;



// Connection to database
require("./mongo")

// Controllers
const{createUser , logUser} = require("./controllers/users")
const{getSauces,createSauce} = require("./controllers/sauces")


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/auth/signup", createUser) 
app.post("/api/auth/login", logUser)
app.get("/api/sauces", getSauces)
app.post("/api/sauces", createSauce)
app.get("/", (req,res)=>res.send("Hello world"))

// Listen
app.listen(port, () => console.log("listening on port " + port));


