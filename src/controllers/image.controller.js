const Image = require("../models/images.model");
const {uploadToCloudinary} = require("../helpers/cloudinary.helper");
const uploadImageController = async(req,res)=>{
    try{
        //check if file is missing
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }

        const {url, publicId} = await uploadToCloudinary(req.file.path);
        const newImage = await Image.create({
            url,
            publicId,
            uploadedBy:req.user._id
        })
        res.status(201).json({message:"Image uploaded successfully",image:newImage});
    }catch(err){
        res.status(500).json({message:"Failed to upload image"});
    }
}

module.exports = {
    uploadImageController
}