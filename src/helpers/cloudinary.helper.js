const cloudinary = require('../config/cloudinary.config');


const uploadToCloudinary = async(filePath)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    }catch(err){
        console.error("Cloudinary upload error:", err);
        throw new Error("Failed to upload image");
    }
}

const deleteFromCloudinary = async(publicId)=>{
    try{
        await cloudinary.uploader.destroy(publicId);
    }catch(err){
        console.error("Cloudinary delete error:", err);
        throw new Error("Failed to delete image");
    }

}
module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
}