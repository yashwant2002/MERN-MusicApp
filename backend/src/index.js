import { connectDB } from "./db/index.js";
import app from "./app.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running at Port : http://localhost:${process.env.PORT}`);
    })
})
.catch((e)=>{
    console.log("MongoDB connection failed", e);
})


