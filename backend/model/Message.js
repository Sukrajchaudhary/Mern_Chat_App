const mongoose = require("mongoose");
const { Schema } = mongoose;
const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
exports.Message = mongoose.model("Message", MessageSchema);
