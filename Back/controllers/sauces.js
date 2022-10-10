const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  console.log("le token à été validé nous sommes ds getSauces");
  // console.log("Le token à l'air bon", decoded);
  Product.find({}).then((products) => res.send(products));
  // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce1" }] });
  
}

function createSauce(req, res) {
  // const sauce = JSON.parse(req.body.sauce);
  const {body,file} = req
  console.log({file});
  const {fileName} = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;
  function makeImageUrl(req, fileName){
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
  }
  // console.log({ body: req.body });
  // console.log({ file: req.file });
  // const imageUrl = req.file.destination + req.file.filename






  const product = new Product({
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    imageUrl: makeImageUrl(req,fileName), 
    heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then(() => console.log("produit enregistré"))
    .catch(console.error);
}
module.exports = { getSauces, createSauce };
// userId: String,
// name: String,
// manufacturer: String,
// description: String,
// mainPepper: String,
// imageUrl: String,
// heat: Number,
// likes: Number,
// dislikes: Number,
// usersLiked: [String],
// usersDisliked: [String],
