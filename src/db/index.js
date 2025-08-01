import mongoose from "mongoose"
import {DB_NAME} from "../constants.js";

const connectDB = async ()=>{
    try{
        console.log("Connecting to:", `${process.env.MONGODB_URI}/${DB_NAME}`);

       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB Connected !! DB HOST : ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("mongoDB connection error",error);
        process.exit(1);
    }
} 

export default connectDB