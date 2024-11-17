const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { decrypt } = require("dotenv");


function userMiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = req.verify(token,JWT_USER_PASSWORD);

    if(decoded){
        req.userID = decoded.id;
        next()
    }else{
        res.status(403).json({
            Message : "you are not signed in"
        })
    }
}

module.exports = {
    userMiddleware : userMiddleware
}