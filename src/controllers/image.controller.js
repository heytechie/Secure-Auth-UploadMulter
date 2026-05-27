const Image = require("../models/images.model");
const {uploadToCloudinary,deleteFromCloudinary} = require("../helpers/cloudinary.helper");
const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");
const path = require("path");

const uploadImageController = async(req,res)=>{
    try{
        //check if file is missing
        const filePath = req.file ? req.file.path : null;
        console.log("File path:", filePath);
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }

        const {url, publicId} = await uploadToCloudinary(req.file.path);
        const newImage = await Image.create({
            url,
            publicId,
            uploadedBy:req.user._id
        })
        fs.unlinkSync(req.file.path);
        res.status(201).json({message:"Image uploaded successfully",image:newImage});
    }catch(err){
        res.status(500).json({message:"Failed to upload image"});
    }
}

const getAllImagesController = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;        
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);
        
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj  ).skip(skip).limit(limit);
        if(!images){
            return res.status(404).json({message:"No images found"});
        }
        res.status(200).json({
            message:"Images retrieved successfully",
            currentPage:page,
            totalPages: totalPages,
            totalImages: totalImages,
            images
        });
    }catch(err){
        res.status(500).json({message:"Failed to retrieve images"});
    }
}

const deleteImageController = async(req,res)=>{
    try{
        const {publicId} = req.params;
        const user = req.user;
        if(!user || user.role !== "admin"){
            return res.status(403).json({message:"Forbidden: Admins only"});
        }
        const image = await Image.findOne({publicId});
        if(!image){
            return res.status(404).json({
                message:"Image not found"
            })
        }
        if(image.uploadedBy.toString()!== user._id.toString()){
            return res.status(403).json({message:"Forbidden: You can only delete your own images"});
        }
        await cloudinary.uploader.destroy(publicId);
        await Image.deleteOne({publicId});
        res.status(200).json({message:"Image deleted successfully"});

    }catch(err){
        res.status(500).json({message:"Failed to delete image"});
    }
}
module.exports = {
    uploadImageController,
    getAllImagesController,
    deleteImageController
}   
