const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    // Si le mot de passe rentré par l'utilisateur ne correspond pas au passwordSchema 
    if (!passwordSchema.validate(req.body.password)) {
        // Alors res.status(400) avec message
        res.status(400).json({ message: 'Le MDP doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins.' });
    } else {
        // Sinon next()
        next();
    }
};