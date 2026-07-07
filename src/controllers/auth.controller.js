const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const blacklistModel=require("../models/blacklist.model")

/**
 * @name registerUserCintroller
 * @description register a new user ,expects username,email and password in the request body
 * @access Public
 */
async function registerUserController(req,res) {

    const {username,email,password}=req.body

    if(!username || !email || !password) {
        return res.status(400).json({message:"All fields are required"})
    }


const isUserAlreadyExists=await userModel.findOne({
    $or:[
        {username},
        {email}
    ]
})

if(isUserAlreadyExists) {
    // isUserAlreadyexits.username === username ? "Username already taken" : "Account already exists with email adress"
    return res.status(400).json({message:"Account already exists with the provided username or email"})
}

const hash = await bcrypt.hash(password,10)

const user=await userModel.create({
    username,
    email,
    password:hash
})

const token=jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"})

res.cookie("token",token)

return res.status(201).json({
    message:"User registered successfully",
    user:{  
         id:user._id,
        username:user.username,
        email:user.email
    },
    // token 
})

}

// login user controller
async function loginuserController(req,res){

    const {email,password}=req.body

    const user = await userModel.findOne({email})
    
    if(!user) {
        return res.status(400).json({message:"Invalid email or password"})
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid) {
        return res.status(400).json({message:"Invalid credentials"})
    }

    const token=jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)
    return res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        },
        // token
    })

}

async function logoutUserController(req,res) {
    const token=req.cookies.token

    if(token){
        await blacklistModel.create({token})
    }
    res.clearCookie("token")
    return res.status(200).json({message:"User logged out successfully"})
}

/**
 * @name getMeController
 * @description get the details of the logged in user
 * @access Private
 */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User details fetched successfully",
        user:{
        id:user._id,
        username:user.username,
        email:user.email
        }
    })
}



module.exports={registerUserController,loginuserController,logoutUserController,getMeController}