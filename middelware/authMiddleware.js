const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    console.log(token)
  
  console.log("token",token)
  if (!token) {
    return res.status(401).json("unauthorized");
  }
  const JWT_SECRET_KEY = process.env.JWT_SECRET;
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json("token is not valid");
    }
    req.user = user;
    next();
  });
};
module.exports = verifyToken;
