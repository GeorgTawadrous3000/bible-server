const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const bibleRoute = require("./routes/bible");
dotenv.config();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({
    origin: "https://bible-client.vercel.app",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

// Conditional CORS Anywhere proxy for development
    const corsAnywhere = require("cors-anywhere");
    const corsProxy = corsAnywhere.createServer({
        originWhitelist: ["https://bible-client.vercel.app"],
        requireHeader: ["origin", "x-requested-with"],
        removeHeaders: ["cookie", "cookie2"],
    });

    app.use("/proxy", (req, res) => {
        corsProxy.emit("request", req, res);
    });


// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.7xcc0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
    res.json("Hi There");
});

app.use("/api/auth", authRoute);
app.use("/api/bible", bibleRoute);

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
