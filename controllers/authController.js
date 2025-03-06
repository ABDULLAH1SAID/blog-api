const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const appError = require("../util/appError")

 const register = async(req,res,next)=>{
 try{
        const {username,email,password} = req.body
        const isExisting = await User.findOne({email:email})
        if(isExisting){
        const error =  appError.create("this email is exisit",409)
        return next(error)
      }
      let salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      const newUser = new User({
        username:username,
        email:email,
        password:hashedPassword
      })
      await newUser.save()
      const token = jwt.sign({id:newUser._id,email:newUser.email},process.env.JWT_SECRET,{expiresIn:'2h'})
      res.header("x-auth-token",token)
      res.json("you are register successfuly")
    }
    catch(error){
       return  next(error)
    }
}



const login = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          const error = appError.create("Please enter email and password", 400); // 400 Bad Request
          return next(error);
      }

      const user = await User.findOne({ email: email });
      if (!user) {
          const error = appError.create("Invalid email or password", 401); // 401 Unauthorized
          return next(error);
      }

      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
          const error = appError.create("Invalid email or password", 401); // 401 Unauthorized
          return next(error);
      }

      const token = jwt.sign(
          { id: user._id, email: user.email }, 
          process.env.JWT_SECRET,
          { expiresIn: '1h' } 
      );

      res.status(200).json({
          email: user.email,
          token: token
      });
  } catch (error) {

      error = appError.create("Something went wrong during login", 500); 
      return next(error);
  }
};



module.exports = {
  register, 
  login,
} 
