import mongoose from "mongoose";

export const connectDB = async()=>{
  try {
    const connnection = await mongoose.connect(process.env.MONGO_DB)
    console.log('db connected');
    
  } catch (error) {
    console.log('error in connecting db',error);
    
  }
}