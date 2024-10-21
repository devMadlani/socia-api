const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json("unauthorized")
    }

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json("token is not valid")
        }
        req.user =  user;
        next()
    });
}
module.exports = verifyToken;