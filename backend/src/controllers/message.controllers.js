import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import userModel from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await userModel
      .find({
        _id: { $ne: loggedInUserId }, //$ne not equal to loggedInUserId
      })
      .select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id; //Authenicated user id from protected route.
    const { id: userToChatId } = req.params;

    /* 
    Me and You 2 cases
    I send you the message =>{ senderId: myId, receiverId: userToChatId }
    you send me the message =>{ senderId: userToChatId, receiverId: myId }
    */

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }); // we gett all messages between me and other user

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl; //using let because it will reassign

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }

    const receiverExists = await userModel.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    if (image) {
      //upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; //get secure url and assign to imageUrl
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    //todo: send message in real-time if user is online - socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/*
Humhe wo messages niklne hai jaha :-
sender hum hone chaye or receiver hum hone chaye
*/
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //find all the messages where the logged-in user is either sender or receiver

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    //we fetch all the messages

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];
    // agar message sender mein hu toh mujhe receiever id chaye aur agar msg sender other user hai toh humari id chaye

    // new Set se remove duplicate kara hai humne aur us sare messages ki value humne ek array mein spread karke chatPartnerIds variable ko assign ki hai

    const chatPartners = await userModel
      .find({ _id: { $in: chatPartnerIds } })
      .select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners controller : ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
