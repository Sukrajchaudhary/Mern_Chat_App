const { Conversations } = require("../model/Converstions");
const { User } = require("../model/User");

exports.CreateConversations = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const existingConversation = await Conversations.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (existingConversation) {
      return res.status(400).send({ flag: false });
    }
    const conversations = new Conversations({
      members: [senderId, receiverId],
    });
    const response = await conversations.save();
    return res.status(200).send(response);
  } catch (error) {
    return res
      .status(200)
      .send(error.message, { message: "Conversations Create Sucessfully" });
  }
};
exports.FinduserById = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });
    const conversationsUser = conversations.map(async (conversation) => {
      const receiveId = conversation.members.find((member) => member != userId);
      const user = await User.findById(receiveId);
      return {
        username: user.username,
        userid: user._id,
        conversationid: conversation._id,
      };
    });
    // Wait for all promises to resolve
    const response = await Promise.all(conversationsUser);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
