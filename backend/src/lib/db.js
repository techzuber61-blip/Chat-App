import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env
        if(!MONGO_URI) throw new Error("MONGO_URI is not defined");
        const conn = await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB", conn.connection.host);
    } catch (error) {
        console.log("Error connection to MONGODB",error);
        process.exit(1);
    }
}

export default connectDB;