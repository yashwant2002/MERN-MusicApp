const mongoose =  require("mongoose");
const DB_NAME = require("../constant.js")

const connectDB = async ()=>{
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected !! DB HOST: ${connectInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection FAILED", error)
        process.exit(1)
    }
}

module.exports = {
    connectDB
}