const User = require("../models/User")

const checkLogin = async (email, password) => {
    const user = await User.findOne({email: email, password: password})
    if(!user){
        return false
    }else{
        return user
    }
}

const checkLoginByUsername = async (email, username) => {
    const user = await User.findOne({email: email, username: username})
    if(!user){
        return false
    }else{
        return user
    }
}


module.exports = {checkLogin, checkLoginByUsername}
