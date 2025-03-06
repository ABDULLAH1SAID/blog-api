const Blog = require('../models/Blog')
const appError = require('../util/appError')

const getBlogs = async(req,res,next)=>{
    try{
        const blogs = await Blog.find({})
        if(!blogs){
            const error = appError.create("No blogs found", 404);
            return next(error)
        }
        return res.status(200).json(blogs)
    }
    catch(err){
        err = appError.create(err.message,500)
        return next(err)
    }
}

const getBlogsById = async(req,res,next)=>{
    try{
        const blog = await Blog.findById(req.params.id)
        if(!blog){
            const error = appError.create("No blogs found", 404);
            return next(error)
        }
        return res.status(200).json(blog)
    }
    catch(err){
        err = appError.create(err.message,500)
        return next(err)
    }
}

const addBlog = async(req,res,next)=>{
    try{
        const blog =  new Blog({...req.body,userId:req.user.id});
        await blog.save()
        return res.status(201).json(blog);
    }
    catch(err){
        err = appError.create("message error",500)
        return next(err)
    }
}

const updateBlog =  async(req,res,next)=>{
    try {
        const blog = await Blog.findById(req.params.id)
            if(blog.userId.toString() !== req.user.id){
            throw new Error("You can update only your own posts")
        }
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        return res.status(200).json(updatedBlog)
    } catch (err) {
        err = appError.create(err.message,500)
        return next(err)
    }
}

const deleteBlog = async(req,res,next)=>{
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.userId.toString() !== req.user.id){
            const error = appError.create("You can update only your own posts",400)
            return next(error)
        }
        await Blog.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg: 'Successfully deleted blog'})
    }
    catch(err){
        err = appError.create(err.message,500)
        return next(err)  
    }
}

module.exports ={
    getBlogs,
    getBlogsById,
    addBlog,
    updateBlog,
    deleteBlog 
}