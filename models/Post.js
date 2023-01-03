import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    descr: { type: String, max: 500 },
    tags: { type: String, default: '' },
    media: { src: { type: String }, blurhash: { type: String } },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    mediaType: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
