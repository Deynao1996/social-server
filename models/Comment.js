import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Comment', CommentSchema)
