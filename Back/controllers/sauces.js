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

function getSauces(req,res) {
  console.log("le token à été validé nous sommes ds getSauces");
    // console.log("Le token à l'air bon", decoded);
    Product.find({}).then((products) => res.send(products));
    // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce1" }] });
}

function createSauce(req, res) {
 const sauce = JSON.parse(req.body.sauce)
 const {name, manufacturer,description,mainPepper,heat,userId} = sauce


  console.log({body: req.body});
  const product = new Product({
    userId: "String",
    name: "String",
    manufacturer: "String",
    description: "String",
    mainPepper: "String",
    imageUrl: "String",
    heat: 2,
    likes: 2,
    dislikes: 2,
    usersLiked: ["String"],
    usersDisliked: ["String"],
  });
  product
    .save()
    .then(() => console.log("produit enregistré"))
    .catch(console.error);
}
module.exports = { getSauces, createSauce};
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
