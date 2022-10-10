require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
// const bodyParser = require("body-parser")
// const path = require("path")
const port = 3000;
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
        destination:"images/",
        filename: function (req, file, cb) {
          cb(null, makeFilename(req,file))
        }
      })

function makeFilename(req,file){
        const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
        file.fileName = fileName
        return fileName
}

const upload = multer({ storage: storage})

// Connection to database
require("./mongo")

// Controllers
const{createUser , logUser} = require("./controllers/users")
const{getSauces,createSauce} = require("./controllers/sauces")


// Middleware
app.use(cors());
app.use(express.json());

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

const {authenticateUser} = require("../Back/middleware/auth")
// const {path} = require("express/lib/application")
// const serveStatic = require("serve-static")
//const multer = require("multer")
// const storage = multer.diskStorage({destisnation: "images/", filename: makeFilename})
//const upload = multer({storage: storage})

// function makeFilename(req,file,cb) {
//         cb(null, Date.now() + "-" + file.originalname)
// }

// Routes
app.post("/api/auth/signup", createUser) 
app.post("/api/auth/login", logUser)
app.get("/api/sauces",authenticateUser, getSauces)
app.post("/api/sauces",authenticateUser,upload.single("image"), createSauce)
app.get("/", (req,res)=>res.send("Hello world"))

// Listen
path.join(__dirname)
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("listening on port " + port));


