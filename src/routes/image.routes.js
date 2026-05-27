const express = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const {uploadImageController,getAllImagesController,deleteImageController} = require("../controllers/image.controller");
const router = express.Router();

router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImageController);
router.get("/get-all", getAllImagesController);
router.delete("/delete/:publicId", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;