import express from 'express'
import { getMessages, sendMessage } from '../controllers/messageController.js'

const router = express.Router()

//Send message
router.post('/', sendMessage)

//Get messages
router.get('/:conversationId', getMessages)

export default router
