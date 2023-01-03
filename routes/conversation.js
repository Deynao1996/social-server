import express from 'express'
import {
  createConversation,
  getConversations,
  deleteConversation
} from '../controllers/conversationController.js'

const router = express.Router()

//Create conversation
router.post('/', createConversation)

//Get conversations
router.get('/:userId', getConversations)

//Delete conversation
router.delete('/:id', deleteConversation)

export default router
