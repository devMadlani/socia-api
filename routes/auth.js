const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Register
router.post("/register", async (req, res) => {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    const user = await newUser.save();

    //jwt token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    //cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3600000,
    });
    res.status(201).json({ user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//login

router.post("/login", async (req, res) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET;

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    console.log(user?._id);
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json("Wrong password");
    }

    const token = jwt.sign({ _id: user.id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.status(200).json({ user, message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout Successfully" });
});
module.exports = router;
