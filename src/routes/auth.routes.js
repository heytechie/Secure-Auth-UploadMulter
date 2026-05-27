const express = require('express');

const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const Auth = require("../models/auth.model");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/change-password", authMiddleware , authController.changePass);

module.exports = router;