const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 16,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max:100
    },
    profilePic: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description:{
        type: String,
        max: 50
    },
    city: {
        type:String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    online: {
        type: Boolean,
        default:false
    },
    devices:{
        type: [mongoose.SchemaTypes.Mixed],
        required: true
    },
    age:{
        type:Number,
        default: 0
    }
}, {timestamps: true})


module.exports = mongoose.model("User", UserSchema)