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
import userRoute from "./routes/user.route.js"
import songRoutes from "./routes/song.route.js";
import playlistRoute from "./routes/playlist.route.js"

// Router Declaration
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/songs", songRoutes);
app.use("/api/playlist", playlistRoute)



export default app;
