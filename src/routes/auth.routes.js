const express = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter =express.Router()


/**
 * @routes POST /api/auth/routes
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @routes POST /api/auth/login
 * @desc Login user
 * @access Public
 * */
authRouter.post("/login",authController.loginuserController)

/**
 * @routes GET /api/auth/logout
 * @desc Logout user
 * @access Private
 * */
authRouter.get("/logout",authController.logoutUserController)

/**
 * @routes GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 * */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter