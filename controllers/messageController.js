import Message from '../models/Message.js'

export const sendMessage = async (req, res, next) => {
  const newMessage = Message(req.body)

  try {
    const savedMessage = await newMessage.save()
    res.status(200).json(savedMessage)
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    res.status(200).json(messages)
  } catch (error) {
    next(error)
  }
}
