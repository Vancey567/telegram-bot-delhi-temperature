// const ChatModel = require('../Models/ChatModel');
import chatModel from '../Models/ChatModel.js';

class ChatService {
    checkExists = (chatId) =>  {
            return chatModel.findOne({chatId: chatId})
            .then((chat) => {
                if(chat) {
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.log({error});
                throw new Error(error)
            })  
    }

    saveChatId = async (chatId) => {
        try {
            const chatObj = new chatModel({
                chatId: chatId
            })
            chatObj.save();
            console.log('User saved successfully');
        } catch (err) {
            console.error(err);
            throw new Error(err);       
        }
    }

    getAllChat = async () => {
        try {
            const data = await chatModel.find();
            console.log({data});
            return data;
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }

    removeChatId = async (chatId) => {
        try {
            const removed = await chatModel.findOneAndDelete({chatId: chatId});
            console.log({removed});
            if(removed) return true;
            return false
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
}

// module.exports = new ChatService();
export default new ChatService();