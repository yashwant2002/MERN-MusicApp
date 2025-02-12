const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")


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




module.exports = {app}