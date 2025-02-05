const mongoose = require('mongoose')

const {Schema} = mongoose

const UserSchema = new Schema ({
    user_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    }
})
module.exports = mongoose.model("user",UserSchema)