// require('dotenv').config({path:'./env'}) // ye completely run hoo skta he prr ye statement require se
//aur baki sare import ,, code ki consistency khrab krata he ,, is liye abhi iska solution he jo nihce kra he
//baki ye bhi chl jata aarma se

import dotenv from "dotenv";

// import mongoose from ('mongoose');
// import {DB_NAME} from "./constants"
import connectDB from "./db/index.js"
import {app} from './app.js'

dotenv.config({
    path: './env'
})



connectDB()
    .then( ()=>{
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log(`server is running at port : ${process.env.PORT}`)
        })
    }
    )
    .catch((err)=>{
        console.log("mongo db connection failed !!",err)
    })


// import express from 'express'
// const app = express()

// (async()=>{
//     try{
//         await    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("erro:",error);
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     }catch(error){
//         console.error("ERROR:",error)
//     }
// })()

// connectDB()