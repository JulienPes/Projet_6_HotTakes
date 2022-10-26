const Sauce = require("../models/Sauce");
// Gestionnaire de fichiers Node permet la création et la géstion des fichiers
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  // Recherche de sauce déjà existante
  Sauce.find()
  // Async si sauces existes res.status(200) affichage json contenant la ou les sauces
    .then((sauces) => res.status(200).json(sauces))
  // Sinon recherche erreur retour 404 affichage json contenant objet error
    .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  // Parse le corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  // Créer une nouvelle instance de "Sauce"
  const sauce = new Sauce({
  // J'utilise le spread operateur qui revient à décomposer le req.body de sauce 
  // name : sauceObject.name
  // manufacturer : sauceObject.manufacturer
  // etc...
      ...sauceObject,
    // Dans le protocol http sur le serveur création d'un objet qui va être inséré dans la base de données contenant le nom del'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // Likes par défaut = 0
    likes: 0,
    // Dislikes par défaut = 0
    dislikes: 0,
// Identifiant des utilisateurs qui ont likés 
    usersLiked: [" "],
    // Identifiant des utilisateurs qui ont dislikés
    usersdisLiked: [" "],
  });
  // Sauvegarde de la sauce
  sauce
    .save()
    // Async retour 201 avec objet contenant message "Sauce enregistrée"
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    // Recherche erreur retour 400 avec objet contenant erreur
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // Récupération de l'identifiant dans le corps de la requête
  Sauce.findOne({ _id: req.params.id })
  // Async retour status 200 avec un json contenant la sauce
    .then((sauce) => res.status(200).json(sauce))
    // Recherche erreur, retour status 404 avec un objet contenant error
    .catch((error) => res.status(404).json({ error }));
};
exports.deleteSauce = (req, res, next) => {
  // Récupération de l'identifiant dans le corps de la requête
  Sauce.findOne({ _id: req.params.id })
  // Async
    .then((sauce) => {
      // Affectation à filename du nom de l'image
      const filename = sauce.imageUrl.split("/images/")[1];
      // Utilisation de la propriété unlink de fileSysteme 
      fs.unlink(`images/${filename}`, () => {
        // Suppression de l'image dans le dossier
        Sauce.deleteOne({ _id: req.params.id })
        // Async, si tt ok (res.status(200) avec msg Sauce supprimée
          .then(res.status(200).json({ message: "Sauce supprimée" }))
          // Sinon recherche erreur retour status 400 avec objet erreur
          .catch((error) => res.status(400).json({ error }));
      });
    })
    // Recherche erreur et retour status 500 avec un objet contenant l'erreur
    .catch((error) => res.status(500).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  // Affectation du corps de la requête à sauceObject
  const sauceObject = req.file
  // If ("Terner")
  // Si il existe un req.file
    ? {
      // Parse du req.body.sauce
        ...JSON.parse(req.body.sauce),
        // changement de la valeur de imageUrl et du filename
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
      // Sinon seulement req.body car il n'y a pas de file
    : { ...req.body };
  // Mise à jour de la sauce
  Sauce.updateOne(
    // Update de la sauce en envoyant l'id en param
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
  // Si ok res.status(200) avec objet contenant message "Sauce modifiée"
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    // Recherche erreur res.status(400) avec json contenant message erreur
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  // Like = like dans le req.body
  let like = req.body.like;
  // userId = userId dans le req.body
  let userId = req.body.userId;
  // userId = id dans le req.params
  let sauceId = req.params.id;

  // Test de différents cas 
  switch (like) {
    // Cas 1 
    case 1:
      // Méthode pour mise à jour de la sauce
      Sauce.updateOne(
        // Sauce qui prend la valeur de sauceId
        { _id: sauceId },
        // Push dans le tableau usersLiked et incrémentation du like
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
      // Async réponse status 200, objet contenant message `J'aime`
        .then(() => res.status(200).json({ message: `J'aime` }))
        // Recherche erreur res.status(400) avec objet contenant l'error
        .catch((error) => res.status(400).json({ error }));

      break;

    case 0:
      // Recherche d'une sauce par l'identifiant
      Sauce.findOne({ _id: sauceId })
      // Async recherche de la présence de l'userId et de la sauce dans le tableau like
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            // Méthode pour mise à jour de la sauce
            Sauce.updateOne(
              // Sauce qui prend la valeur de sauceId
              { _id: sauceId },
              // Push dans le tableau usersLiked et décrémentation du like
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              // Async réponse status 200, objet contenant message `Neutre`
              .then(() => res.status(200).json({ message: `Neutre` }))
               // Recherche erreur res.status(400) avec objet contenant l'error
              .catch((error) => res.status(400).json({ error }));
          }
          // Recherche de la présence de l'userId et de la sauce dans le tableau dislike
          if (sauce.usersDisliked.includes(userId)) {
            // Méthode pour mise à jour de la sauce
            Sauce.updateOne(
              // Sauce qui prend la valeur de sauceId
              { _id: sauceId },
              // Push dans le tableau usersLiked et décrémentation du like
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              // Async réponse status 200, objet contenant message `Neutre`
              .then(() => res.status(200).json({ message: `Neutre` }))
              // Recherche erreur res.status(400) avec objet contenant l'error
              .catch((error) => res.status(400).json({ error }));
          }
        })
        // Recherche d'une erreur avec res.status 404 si pas d sauce existante crée par utilisateur et retour objet erreur
        .catch((error) => res.status(404).json({ error }));
      break;

    case -1:
      // Méthode pour mise à jour de la sauce
      Sauce.updateOne(
        // Sauce qui prend la valeur de sauceId
        { _id: sauceId },
        // Push dans le tableau usersDisliked et incrémentation du dislikes
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          // Async réponse status 200, objet contenant message `Je n'aime pas`
          res.status(200).json({ message: `Je n'aime pas` });
        })
         // Recherche erreur res.status(400) avec objet contenant l'error
        .catch((error) => res.status(400).json({ error }));
      break;
        // Comportement en cas de problème 
    default:
      // Log erreur
      console.log(error);
  }
};
