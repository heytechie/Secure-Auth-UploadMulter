const express = require('express');
const authRoutes = require("./routes/auth.routes");
const homeRoutes = require("./routes/home.routes");
const imageRoutes = require("./routes/image.routes");
const authMiddleware = require("./middleware/auth.middleware");
const app = express();
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/home", authMiddleware, homeRoutes);
app.use("/api/image", authMiddleware, imageRoutes);

module.exports = app;