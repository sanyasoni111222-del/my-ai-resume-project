const {Router} = require('express')
const authController = require("../controllers/auth.controller")
const authRouter = Router()
const { authUser } =require("../middlewares/auth.middleware")
/**
 * @route POST/api/auth/register
 * @discription Register a new user
 * @acess Public
 */

authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access public
 */
 authRouter.post("/login",authController.loginUserController)

/**
 * @route  GET/api/auth/logout
 * @description clear  tooken from user cookie and add the token  in blacklist
 */
   authRouter.get("/logout",authController.logoutUserController)

 /**
  * @route GET /api/auth/get-me
  * @description get the current logged in user details
  * @acess public
  */

authRouter.get("/get-me",authUser, authController.getMeController)
module.exports = authRouter