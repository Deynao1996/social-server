import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import usersRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import messageRouter from './routes/message.js'
import notificationRouter from './routes/notification.js'
import conversationRouter from './routes/conversation.js'
import commentRouter from './routes/comment.js'
import postsRouter from './routes/post.js'
import { handleErrors } from './middlewares/handleErrors.js'
import Post from './models/Post.js'
import cron from 'node-cron'
import Comment from './models/Comment.js'
import Message from './models/Message.js'
import User from './models/User.js'

dotenv.config()
const app = express()

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB')
  } catch (error) {
    throw error
  }
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, DELETE, PUT',
    credentials: true
  })
)
app.use(express.json())
app.use(helmet())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/post', postsRouter)
app.use('/api/messages', messageRouter)
app.use('/api/conversations', conversationRouter)
app.use('/api/comments', commentRouter)

app.use(handleErrors())

cron.schedule('0 0 */2 * * *', async () => {
  if (process.env.APP_STATUS === 'demo') {
    try {
      const [deletedPosts, deletedComments, deletedMessages, deletedUsers] =
        await Promise.all([
          Post.deleteMany({ isTest: true }),
          Comment.deleteMany({ isTest: true }),
          Message.deleteMany({ isTest: true }),
          User.deleteMany({ isTest: true })
        ])
      console.log(
        `Deleted ${deletedPosts.deletedCount} test posts, ` +
          `${deletedComments.deletedCount} test comments, ` +
          `${deletedUsers.deletedCount} test users, ` +
          `and ${deletedMessages.deletedCount} test messages.``The time is ${new Date().getHours()}:${new Date().getMinutes()}.`
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }
})

app.listen(process.env.PORT || 5000, () => {
  connectToDataBase()
  console.log('Connected to Server')
})
