import Conversation from '../models/Conversation.js'
import User from '../models/User.js'
import Message from '../models/Message.js'
import { ObjectId } from 'mongodb'
import { createError } from '../utils/error.js'

export const createConversation = async (req, res, next) => {
  try {
    const sender = await User.findById(req.body.senderId).select(
      '_id name lastName profilePicture'
    )
    const receiver = await User.findById(req.body.receiverId).select(
      '_id name lastName profilePicture'
    )
    const savedConversation = await new Conversation({
      members: [sender, receiver]
    }).save()
    res.status(200).json(savedConversation)
  } catch (error) {
    next(error)
  }
}

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $elemMatch: { _id: new ObjectId(req.params.userId) } }
    }).sort({ createdAt: -1 })
    res.status(200).json(conversations)
  } catch (error) {
    next(error)
  }
}

export const deleteConversation = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to delete conversation in demo mode'
        )
      )
    }

    await Conversation.findByIdAndDelete(req.params.id)
    await Message.deleteMany({ conversationId: req.params.id })
    res.status(200).json('Conversation has been deleted')
  } catch (error) {
    next(error)
  }
}
