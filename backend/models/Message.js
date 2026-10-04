import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required."]
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required."]
    },
    content: {
      type: String,
      required: [true, "Message content is required."],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: "messages"
  }
);

// Indexes for fast conversation retrieval and unread message lookups
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
