import express from "express"
import dotenv from "dotenv"
import {ENV} from "./lib/env.js"
const app=express()

dotenv.config();
console.log(ENV.PORT);
console.log(ENV.DB_URL);

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
})

app.listen(ENV.PORT,()=> console.log("server is running on port:",ENV.PORT))
