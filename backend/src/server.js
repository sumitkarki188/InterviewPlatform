import express from "express"
import dotenv from "dotenv"
import {ENV} from "./lib/env.js"
import path from "path"

const app=express()

dotenv.config();

const __dirname=path.resolve()

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
})
app.get("/books",(req,res)=>{
    res.status(200).json({msg:"this is the books endpoint"})
})



//make ready for deployement
if(ENV.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

app.listen(ENV.PORT,()=> console.log("server is running on port:",ENV.PORT))
