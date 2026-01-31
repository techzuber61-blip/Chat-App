import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUserId = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json(filteredUserId)
    } catch (error) {
        console.log("Error in getAllContacts controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id
        const {id: userToChatId} = req.params;
        const messages = await Message.find({
            $or: [
                {senderId: userToChatId, receiverId: myId},
                {senderId: myId, receiverId: userToChatId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessagesByUserId controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({ 
            text, 
            image: imageUrl, 
            senderId, 
            receiverId 
        });

        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller ",error.message)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all the messages where the sender or receiver is the logged-in user
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        
        const chatPartnersIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                    ? msg.receiverId.toString()
                    : msg.senderId.toString()
                )
            )
        ];

        // console.log(chatPartnersIds)

        
        const chatPartners = await User.find({ _id: { $in: chatPartnersIds } }).select("-password");
        
        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners controller ",error)
        res.send(500).json({message: "Internal Server Error"})
    }
}