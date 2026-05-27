const Auth = require("../models/auth.model");
const JWT = require("jsonwebtoken");

const authMiddleware = async (req,res,next)=>{
    try{
        const authHeader  = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded = JWT.verify(token,process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user = user;
        next(); 
    }
    catch(err){
        res.status(401).json({message:"Unauthorized"});
    }
}

module.exports = authMiddleware;