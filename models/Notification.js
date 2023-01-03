import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'new-follower',
        'new-unfollower',
        'new-comment',
        'new-like',
        'new-message',
        'new-conversation'
      ],
      required: true
    },
    meta: { type: Object }
  },
  { timestamps: true }
)

export default mongoose.model('Notification', NotificationSchema)
