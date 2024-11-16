function createUserRoutes(app){
    app.post('/user/signup',function(req,res){
        res.json({
            message: "signup endpoint"
        })
    })
    
    app.post("/user/signin",function(req,res){
        res.json({
            message: "signin endpoint"
        })
    })
    
    app.get("/user/purchases",function(req,res){
        res.json({
            message: "purchases endpoint"
        })
    })
}


module.exports = {
    createUserRoutes : createUserRoutes
}