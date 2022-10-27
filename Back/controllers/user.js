const User = require("../models/user");
// bcrypt = plugin hashage de mot de passe irreversible
const bcrypt = require("bcrypt");
// Jeton permettant un échange sécurisé de données
const jwt = require("jsonwebtoken");
// .env permet de gérer un projet multi-environnement au travers de fichiers
require("dotenv").config();

exports.signup = (req, res, next) => {
  // Affectation à mail du req.body.email
  const mail = req.body.email;
  // Méthode hash de bcrypt avec en param le password saisie par user et grain de sel
  bcrypt
    .hash(req.body.password, parseInt(process.env.SALT))
    // Async
    .then((hash) => {
      // Création d'une nouvelle instance du modèle "User"
      const user = new User({
        // Email = mail inserer par new utilisateur
        email: mail,
        // Password = hash du password entré par l'utilisateur
        password: hash,
      });
      // Méthode de sauvegarde mongoose
      user
        .save()
        // Retourne une réponse 201 avec un objet contenant le message utilisateur créé
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        // Recherche d'une erreur retournant une reponse 400 et un objet erreur
        .catch((error) => res.status(400).json({ error }));
    })
    // Recherche d'une erreur
    .catch((error) => {
      // Log de l'erreur
      console.log(error);
      // Retourne une réponse 500 avec un objet erreur
      return res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  // Récuperation de l'email dans le corps de la requête
  const mail = req.body.email;
  // Recherche de la présence d'un utilisateur ayant cet email dens la base de données
  User.findOne({ email: mail })
    // Async
    .then((user) => {
      // Si il n'y a pas d'utilisateur
      if (!user) {
        // Renvoi d'une reponse 401 avec un objet 'Utilisateur non trouvé !'
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Comparaison du mot de passe envoyé avec ceux déjà hachés dans bcrypt
      bcrypt
        .compare(req.body.password, user.password)
        // Async
        .then((valid) => {
          // Si le mot de passe n'est pas trouvé dans la base de données
          if (!valid) {
            // Renvoi d'une reponse 401 avec un objet 'Mot de passe incorrect !'
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Sinon retour 200 avec objet contenant identifiant utilisateur
          res.status(200).json({
            userId: user._id,
            // Utilise la méthode sign de jasonWebToken pour créer le token
            token: jwt.sign(
              // Objet contenant identifiant utilisateur
              { userId: user._id },
              // J'ajoute le grain de sel present dans mon .env
              process.env.SECRET_TOKEN,
              // Durée d'expiration pour la token
              { expiresIn: "24h" }
            ),
          });
        })
        // Recherche d'une erreur et retour d'un status 500 et d'un objet erreur
        .catch((error) => res.status(500).json({ error }));
    })
    // Recherche d'une erreur et retour d'un status 500 et d'un objet erreur
    .catch((error) => res.status(500).json({ error }));
};
