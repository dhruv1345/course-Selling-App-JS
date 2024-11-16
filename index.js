const express = require("express");
const {createUserRoutes} = require("./routes/user.js");
const { createCourseRoutes } = require("./routes/course.js");
const { createCourseRoutes } = require("./routes/course.js");
const app = express();
const PORT = 3000;

app.use("/user", createUserRoutes);
app.use("/course",createCourseRoutes);

createUserRoutes(app);
createCourseRoutes(app);

app.listen(PORT);