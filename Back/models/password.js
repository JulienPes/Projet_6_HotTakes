// Validateur de mot de passe
const passwordValidator = require('password-validator');
// Affectation d'un nouveau modèle passwordValidator à passwordSchema
const passwordSchema = new passwordValidator();
// Création du schema
passwordSchema
// Min 6 caractères
.is().min(6)    
// Max 15 caractères                                
.is().max(15)    
// A lettre(s) majuscule(s)                            
.has().uppercase() 
// A lettre(s) minuscule(s)                              
.has().lowercase()  
// A chiffre(s)                           
.has().digits()
// N'a pas d'espace                                
.has().not().spaces()                    

module.exports = passwordSchema;
