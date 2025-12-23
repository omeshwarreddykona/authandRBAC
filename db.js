import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/Authentication")
        console.log("MongoDB is Connected Successfully!");
    }catch(error){
        console.log("MongoDB Connection Failed!");
        process.exit(1);
    }
};

 export default connectDB;