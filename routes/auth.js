const express = require("express")
const router = express.Router()
const User = require("../models/User")
const {checkLogin, checkLoginByUsername} = require('../utils/checkLogin');


router.post("/register", async (req, res) => {
    try {
        var user = await checkLoginByUsername(req.body.email, req.body.username)
        var lang = req.body.lang
        if(user === false){}else{ res.status(400).json(lang === "en" ? "User found. Login, please." : "هناك مستخدم بهذه البيانات"); return}
        
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            devices: [req.body.userAgent]
        })
        user = await user.save()
        user.password = ""
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/onlinelogedDevice", async (req, res) => {
    try{
        const user = await checkLogin(req.body.email, req.body.password)
        await user.updateOne({$pull: {devices: [...req.body.userAgent, "offline"]}})
        await user.updateOne({$push: {devices: [...req.body.userAgent, "online"]}})
        res.json("device online")
    }catch(error){
        res.json(error)
    }
})

router.post("/offlinelogedDevice", async (req, res) => {
    try{
        const user = await checkLogin(req.body.email, req.body.password)
        await user.updateOne({$pull: {devices: [...req.body.userAgent, "online"]}})
        await user.updateOne({$push: {devices: [...req.body.userAgent, "offline"]}})
        res.json("device online")
    }catch(error){
        res.json(error)
    }
})

router.post("/login", async (req, res) => {
    try{
        const user = await checkLogin(req.body.email, req.body.password)
        var lang = req.body.lang
        if(user === false){
            res.status(400).send(lang === "en" ? "User not found" : "لم يتم العثور علي مستخدم")
        }else{
            await user.updateOne({$pull: {devices: [...req.body.userAgent, "offline"]}})
            await user.updateOne({$push: {devices: [...req.body.userAgent, "online"]}})
            user.password = ""
            res.status(200).json(user)
        }

    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/logout", async (req, res) => {
    try {
        const user = await checkLoginByUsername(req.body.email, req.body.username)
        if(user === false){ res.status(400).json("user not found"); return}
        
        await user.updateOne({$pull: {devices: [...req.body.userAgent, "online"]}})
        await user.updateOne({$push: {devices: [...req.body.userAgent, "offline"]}})

        res.status(200).json("logged out")
    }catch(error){
        res.status(200).json(error)
    }
    
})


module.exports = router
