const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")




const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))


/* require all the routes*/
const authRouter=require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")

/* using all the routes */
app.use("/api/auth/",authRouter)
app.use("/api/interview",interviewRouter)    

module.exports=app