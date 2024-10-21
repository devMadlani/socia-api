const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Register
router.post("/register", async (req, res) => {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET;
    //Generate New Password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });

    //save user and return response
    const user = await newUser.save();

    //jwt token

    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    //cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7200000,
    });
    res.status(201).json({ user , message: "User registered successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    console.log(validPass);
    !validPass && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
