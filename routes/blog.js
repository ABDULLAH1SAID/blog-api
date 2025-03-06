const express = require('express');
const router = express.Router();
const verifyToken = require('../middleWares/verifyToken')
const blogController = require('../controllers/blogController');

router.get('/findAll', blogController.getBlogs);

router.get('/find/:id', blogController.getBlogsById);

router.post('/',verifyToken,blogController.addBlog);

router.put('/updateBlog/:id',verifyToken, blogController.updateBlog);

router.delete('/deleteBlog/:id',verifyToken, blogController.deleteBlog);


module.exports = router;