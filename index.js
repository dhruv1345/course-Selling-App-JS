const express = require("express");
const mongoose = require("mongoose");

require('dotenv').config();

const { userRouter } = require("./routes/user.js");
const { courseRouter } = require("./routes/course.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

const startServer = async () => {
    try {
        await mongoose.connect(
            process.env.DB_CONNECTION_STRING
        );
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log("connection established");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};

startServer();
