import mongoose from 'mongoose';

const dbURL = "mongodb://127.0.0.1:27017/DevFlow";

const connectDB = (dbURL) => {
    mongoose.connect(dbURL)
    .then(() => console.log("connected to database"))
    .catch(err => {
        console.log("failed to connect to database")
        console.log(err);
    })
}

export default connectDB;