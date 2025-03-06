
const User = require('../models/User')
const appError = require('../util/appError')
const bcrypt = require('bcrypt');

const getUsers = async(req,res,next)=>{
    try{
        const users = await User.find()
        const formattedUsers = users.map((user)=>{
            return{
                username:user.username, 
                email: user.email,
                _id: user._id, 
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })
        return res.status(200).json(formattedUsers)
    }
    catch(err){
        err = appError.create(err.message,500)
        return next(err)  
    }
}

const getUserById = async(req,res,next)=>{
    try{
    const user = await User.findById(req.params.userId)
    if(!user){
        const error = appError.create("No User",404)
        return next(error)
        }
    return res.status(200).json(user)
}
catch(err){
    err = appError.create(err.message,500)
    return next(err)
}
}

const updateUser = async(req,res,next)=>{
    try{
        if(req.params.userId!==req.user.id){
            const error = appError.create("you can update only your own profile",500)
           return next(error)
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password,10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{ $set: req.body }, { new: true });
        if (!updatedUser) {
            const error = appError.create("user not found",404)
            return next(error)
        }
        res.status(200).json(updatedUser)
    }
    catch(err){
        err = appError.create(err.message,500)
       return next(err)
    }
}

const deleteUser = async(req,res,next)=>{
    try{
        if(req.params.userId!==req.user.id){
            const error = appError.create("you can update only your own profile",500)
           return next(error)
        }
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            const error = appError.create("user not found",404)
            return next(error)
        }
        res.status(200).json("User deleted successfully")
    }
    catch(err){
        err = appError.create(err.message,500)
        next(err)
    }
}
module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}