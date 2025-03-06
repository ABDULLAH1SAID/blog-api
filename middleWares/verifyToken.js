
const jwt = require('jsonwebtoken')
const appError = require('../util/appError.js')

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Authorization Header:", req.headers.authorization);
    if(!token){
        const error =appError.create("please send token",401)
        return next(error)
    }
    try{
    const decoded =  jwt.verify(token,process.env.JWT_SECRET)
    req.user = decoded;
    next()
    }
    catch(err){
        const error = appError.create("Invalid or expired token", 403);
        next(error);
    }
}
module.exports = verifyToken
