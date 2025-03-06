const express = require('express')
const mongoose = require('mongoose');
const app = express()
const authRouter = require('./routes/auth')
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')
const appError = require('./util/appError')

require('dotenv').config();

port = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
                                       .then(() => console.log("MongoDB Connected"))
                                       .catch((error) => console.error("Connection error:", error));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/auth',authRouter)
app.use('/blog',blogRouter)
app.use('/user',userRouter)


app.all('*', (req, res, next) => {
    const error = appError.create("Route not found", 404);  
    next(error);  
});

app.use((error,req,res,next)=>{
    const statusCode = error.statusCode|| 5000
    res.status(statusCode).json({
        message:error.message||"Intrenal Server Error",
        statuesCode:statusCode
    })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
