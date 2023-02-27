const express = require("express")
const app = express()
const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const bibleRoute = require("./routes/bible")
dotenv.config()


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware ware
    next();
});
  

const uri = "mongodb+srv://"+process.env.MONGODB_USER+":"+process.env.MONGODB_PASSWORD+"@cluster0.fmbi09m.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})


app.get("/", (req, res)=>{
    res.json("Hi There")
})

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use("/api/auth", authRoute)
app.use("/api/bible", bibleRoute)


app.listen(process.env.PORT || 80)
