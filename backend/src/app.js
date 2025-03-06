import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

dotenv.config({
    path:"./.env"
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(cookieParser());

// Router Import
import authRoute from "./routes/auth.route.js"
import songRoutes from "./routes/songRoutes.js";

// Router Declaration
app.use("/auth", authRoute)
app.use("/api/songs", songRoutes);



export default app;
