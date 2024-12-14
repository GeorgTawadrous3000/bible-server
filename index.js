const express = require("express")
const app = express()
const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const bibleRoute = require("./routes/bible")
dotenv.config()

const corsAnywhere = require("cors-anywhere");

// Middleware to allow CORS for your API
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "https://bible-client.vercel.app");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-Type"
    );

    // Allow credentials (if required)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Pass to next middleware
    next();
});

// Setup CORS Anywhere as a proxy server
const corsProxy = corsAnywhere.createServer({
    originWhitelist: ["https://bible-client.vercel.app"], // Allow only this origin
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"], // Remove sensitive headers
});

// Define a route for the proxy
app.use("/proxy", (req, res) => {
    corsProxy.emit("request", req, res);
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
