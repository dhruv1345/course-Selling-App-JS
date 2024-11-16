const {Router} = require("express");
const courseRouter = Router();

console.log("hello course");


    courseRouter.post("/purchase",function(req,res){
        res.json({
            message: "purchase the course baby"
        })
    })
    
    courseRouter.get("/preview",function(req,res){
        res.json({
            message: "courses endpoint"
        })
    })


module.exports = {
    courseRouter : courseRouter
}