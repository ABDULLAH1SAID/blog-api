const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        min: 4
    },
    desc: {
        type: String,
        required: true,
        min: 12
    },
    categories: {
        type: Array,
        default: []
    }
},{timestamps:true})

Blog = mongoose.model('Blog',BlogSchema)

module.exports = Blog

