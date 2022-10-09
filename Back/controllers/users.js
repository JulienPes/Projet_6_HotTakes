const { User } = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "Utilisateur enregistré !" });
  } catch (err) {
    res.status(409).send({ message: "User pas enregistré" + err });
  }
};

const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const logUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      res.status(403).send({ message: "Mot de passe incorrect" });
    }
    const token = createToken(email);
    res.status(200).send({ userId: user._id, token: token });

    function createToken(email) {
      const jwtPassword = process.env.JWT_PASSWORD;
      return jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur interne" });
  }
};

//User.deleteMany({}).then(() => console.log("All removed !"));
module.exports = { createUser, logUser };
