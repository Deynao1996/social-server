import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      lowercase: true
    },
    password: { type: String, required: true, min: 6 },
    name: { type: String, required: true, lowercase: true },
    lastName: {
      type: String,
      required: true,
      lowercase: true
    },
    profilePicture: {
      type: String,
      default: 'https://kremen.gov.ua/assets/images/no-user-icon.jpg'
    },
    coverPicture: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1562646329-0d0f4d3bf503?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    descr: { type: String, max: 50, default: 'Welcome to my Profile!' },
    city: {
      type: String,
      max: 50,
      default: 'No information yet',
      lowercase: true
    },
    from: {
      type: String,
      max: 50,
      default: 'No information yet',
      lowercase: true
    },
    relationship: { type: Number, enum: [0, 1, 2, 3] },
    isTest: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
