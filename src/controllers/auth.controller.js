const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Auth = require("../models/auth.model");

const register = async (req,res)=>{
    try{
        const {username,email,password,role} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"username, email and password are required"});
        }
        const existingUser = await Auth.findOne({$or:[{username},{email}]});
        if(existingUser){
            return res.status(400).json({message:"Username or email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser  = await Auth.create({
            username,
            email,
            password:hashedPassword,
            role:role || "user"
        })
       
        const token = jwt.sign({
            id:newUser._id,
            username:newUser.username,
        },process.env.JWT_SECRET,{
            expiresIn:"1h"
        });
        res.cookie("token",token);
        res.status(201).json({message:"User registered successfully"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"email and password are required"});
        }
        const user = await Auth.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const passMatch = await bcrypt.compare(password,user.password);
        if(!passMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token = jwt.sign({
            id:user._id,
            username:user.username,
        },process.env.JWT_SECRET,{
            expiresIn:"1h"
        });
        res.cookie("token",token);
        res.status(200).json({message:"Login successful"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

const changePass = async(req,res)=>{
    try{
       const user  = req.user;
       if(!user){
        return res.status(401).json({message:"Unauthorized"});
       }
       const userFind = await Auth.findById(user._id);
        if(!userFind){
            return res.status(404).json({message:"User not found"});
        }
        const {password,newPassword} = req.body;
        const passMatch  = await bcrypt.compare(password,userFind.password);
        if(!passMatch){
            return res.status(400).json({message:"Current password is incorrect"});
        }
        const hashNewPass = await bcrypt.hash(newPassword,10);
        userFind.password = hashNewPass;
        await userFind.save();
        res.status(200).json({message:"Password changed successfully"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports = {
    register,
    login,
    changePass
};