// Jeton permettant un échange sécurisé de données
const jwt = require('jsonwebtoken');
// .env permet de gérer un projet multi-environnement au travers de fichiers
require('dotenv').config();


module.exports = (req, res, next) => {
  try {
    // Récuperation de l'authorization
    const token = req.headers.authorization.split(' ')[1];
    // Vérifie le grain de sel dans mon .env avec la méthode verify de jason web token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    // Récuperation de l'id utilisateur dans l'objet decoded token
    const userId = decodedToken.userId;
    // Si l'id utilisateur présent dans le corps de la requête est different de l'identifiant récuperer dans le jwt
    if (req.body.userId && req.body.userId !== userId) {
    // Envoi d'une réponse 'Invalid user ID'
      throw 'Invalid user ID';
    } else {
      // Sinon aller au middleware suivant
      next();
    }
    // Si erreur
  } catch {
    // Retour status 401 
    res.status(401).json({
      // Envoi d'une nouvelle erreur avec le message Invalid request
      error: new Error('Invalid request!')
    });
  }
};