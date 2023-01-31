// const mongoose = require('mongoose');
import mongoose from "mongoose";

const Connection = async (URL) => {
    try {
        await mongoose.connect(URL, { useNewUrlParser: true })
        console.log('Database connected');
    } catch (error) {
        console.log('Error Connecting to DataBase ', error);
    }
};

// module.exports = Connection;
export default Connection;