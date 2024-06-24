const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const welcomeUser = (req, res) => {
  res.send("in Users");
};

const addUser = async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const realUser = {
      ...user,
      password: hashedPassword,
    };
    console.log(realUser);
    await User.create(realUser)
    res.status(201).json({ message: "User created successfully", user: realUser });
  } catch (err) {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
      } else if (err.errors) {
        const errors = Object.keys(err.errors).map(field => err.errors[field].message);
        res.status(400).json({ message: errors.join(' ') });
      } else {
        res.status(500).json({ message: "An unexpected error occurred." });
      }
  }
};

const authUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ error: "Email and password are required." });
      }
      const user = await User.findOne({ email });
  
      console.log(user);
      if (!user) {
        return res.status(400).send({ error: "Invalid email or password." });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({ error: "Invalid email or password." });
      }
  
      const token = jwt.sign(
        {
          id: user._id,
          uname: user.email,
        },
        "secretkeyappearshere", 
        { expiresIn: "30s" } 
      );
  
      console.log(token);
      console.log(jwt.decode(token));
      res.status(200).send({ token });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  };

module.exports = {
  welcomeUser,
  addUser,
  authUser
};
