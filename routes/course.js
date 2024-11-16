function createCourseRoutes(app){
    app.post("/course/purchase",function(req,res){
        res.json({
            message: "purchase the course baby"
        })
    })
    
    app.get("/course/preview",function(req,res){
        res.json({
            message: "courses endpoint"
        })
    })
}

module.exports = {
    createCourseRoutes : createCourseRoutes
}