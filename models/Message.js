import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    sender: {
      senderId: { type: String, required: true },
      fullName: { type: String, required: true },
      profilePicture: { type: String, default: '' }
    },
    text: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Message', MessageSchema)
