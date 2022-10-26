module.exports = (req, res, next) => {
    const validEmail = (email) => {
        // Régex pour adresse email
        let emailRegexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        // Test de la conformité de l'adresse email
        let isRegexTrue = emailRegexp.test(email)
        // Si adresse conforme aller au middleware suivant
        isRegexTrue ? next() : res.status(400).json({ message: 'mail non valide' });
    }
    // Appel de la fonction de validation de l'email avec l'email de l'utilisateur en param
    validEmail(req.body.email)
  };