const {Router} = require("express");
const courseRouter = Router();
const {userMiddleware} = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");

console.log("hello course");


    courseRouter.post("/purchase",userMiddleware, async function(req,res){
        const userId = req.userID;
        const courseId = req.body.courseId;

        await purchaseModel.create({
            userId,
            courseId
        })

        res.json({
            message: "purchase the course baby"
        })
    })
    
    courseRouter.get("/preview",async function(req,res){
        const courses = await courseModel.find({});

        res.json({
            message: "courses endpoint",
            courses
        })
    })


module.exports = {
    courseRouter : courseRouter
}