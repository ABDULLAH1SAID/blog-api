 const express = require("express")
 const router = express.Router()
 const userController = require("../controllers/userController.js")
 const verifyToken = require('../middleWares/verifyToken.js')

 router.get("/findAll" ,userController.getUsers)
 router.get("/findUser/:userId" ,userController.getUserById)
 router.patch("/update/:userId",verifyToken,userController.updateUser)
 router.delete("/delete/:userId",verifyToken,userController.deleteUser)

 module.exports = router