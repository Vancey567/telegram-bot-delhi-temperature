// const mongoose = require('mongoose');
import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema({
    chatId: { type: Number, required: true, unique: true}
}, {timestamps: true})

// module.exports = mongoose.model('ChatId', chatSchema);
const chatModel = mongoose.model('ChatId', chatSchema);
export default chatModel;