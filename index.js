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
    // Allow requests from a specific origin
    res.setHeader("Access-Control-Allow-Origin", "https://bible-client.vercel.app");

    // Allow specific request methods
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Allow specific request headers
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-Type"
    );

    // Allow credentials (if required)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Handle preflight requests (OPTIONS method)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Pass to the next middleware
    next();
});


const uri = "mongodb+srv://"+process.env.MONGODB_USER+":"+process.env.MONGODB_PASSWORD+"@cluster0.7xcc0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
