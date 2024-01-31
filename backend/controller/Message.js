const { Message } = require("../model/Message");

exports.CreateMessage = async (req, res) => {
  try {
    const message = new Message({
      conversationId: req.body.conversationId,
      message: req.body.message,
      senderId: req.body.senderId, // Fix the typo here
      receiverId:req.body.receiverId,
   
    });
    const response = await message.save();
    return res.status(200).send({response,message:"Message Sent Successfully"});
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.getMessage=async(req,res)=>{
    try {
        const {coneversationsId}=req.params;
        const message= await Message.find({conversationId:coneversationsId}).sort({createdAt:1});
        return res.status(200).send(message)
    } catch (error) {
        return res.status(200).send(error.message);
    }
}