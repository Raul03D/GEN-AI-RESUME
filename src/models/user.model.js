const mongoose =require("mongoose")



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already taken"],
        require:true,
    },

    email:{
        type:String,
        unique:[true,"Account already exists with email adress "],
        require:true,
    },
    password:{
        type:String,
        require:true
    }
})

const userModel = mongoose.model("users",userSchema)
module.exports=userModel