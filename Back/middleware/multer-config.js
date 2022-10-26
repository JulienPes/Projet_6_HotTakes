// Package de gestion de fichiers
const multer = require("multer");

// indication de la nature et du format des documents.
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
// Méthode diskStorage de multer configure le chemin et le nom de fichier pour les fichiers entrants
// Envoi dans le disc local
const storage = multer.diskStorage({
  // Destination de mon fichier
  destination: (req, file, callback) => {
  // Nom de la déstination ("images")
    callback(null, "images");
  },
  // Quel est le nom de mon fichier
  filename: (req, file, callback) => {
    // Remplace les espaces par "_"
    const name = file.originalname.split(" ").join("_");
    // Vérifie que ça correspond bien au "MIME_TYPES"
    const extension = MIME_TYPES[file.mimetype];
    // Renvoi du nom du fichier avec la reconstruction du nom d'image enfaisant le nom + la date en ms + .extension du fichier 
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
