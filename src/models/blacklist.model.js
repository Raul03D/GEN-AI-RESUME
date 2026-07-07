const mongoose=require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        require:[true,"Token is required"]
    }
    
},{
    timestamps:true

})

const TokenBlacklistModel = mongoose.model("blacklistTokens",blacklistTokenSchema)

module.exports=TokenBlacklistModel