const {User} = require("../mongo")
const bcrypt = require("bcrypt")

const createUser =  async (req,res) =>{
    const {email , password} = req.body
    const hashedPassword = await hashPassword(password)

    console.log(password);
    console.log(hashedPassword);
  const user = new User({ email, password: hashedPassword })
  user
    .save()
    .then(() =>  res.status(201).send({ message: "Utilisateur enregistré" }))
    .catch((err) => res.status(409).send({message: "User pas enregistré" + err}))
  }

  const hashPassword = (password) =>{
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)

  }

  const logUser = async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email: email})

   const isPasswordOk = await bcrypt.compare(password, user.password)
   if(!isPasswordOk){
    res.status(403).send({ message: "Mot de passe incorrect" })
   }
   if(isPasswordOk){
    res.status(200).send({ message: "Connexion réussie" })
   }
    console.log("user",user);
    console.log("isPasswordOk",isPasswordOk);
  }

  module.exports = {createUser, logUser } 