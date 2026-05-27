const express = require('express');

const router = express.Router();
const authController = require("../controllers/auth.controller");
const Auth = require("../models/auth.model");


router.post("/register", authController.register);
router.post("/login", authController.login);


module.exports = router;