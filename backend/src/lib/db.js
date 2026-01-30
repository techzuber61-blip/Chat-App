import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB", conn.connection.host);
    } catch (error) {
        console.log("Error connection to MONGODB",error);
        process.exit(1);
    }
}

export default connectDB;