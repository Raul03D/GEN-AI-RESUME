const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Trust reverse proxy (needed for secure cookies behind Render/Railway/Heroku/AWS proxies)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(cors({
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.startsWith("http://localhost:") ||
            (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL.replace(/\/$/, "")) ||
            origin.endsWith(".vercel.app") // allows Vercel preview and production deployments
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Root health check endpoint for cloud platform liveness probes
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AI Resume & Interview Prep API is running"
    });
});

/* require all the routes */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes */
app.use("/api/auth/", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;