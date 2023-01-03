import express from 'express'
import {
  countMessageNotifications,
  createNotification,
  deleteAllNotifications,
  deleteNewMessagesNotifications,
  getAllNotifications,
  updateNotification
} from '../controllers/notificationController.js'

const router = express.Router()

//CREATE
router.post('/', createNotification)

//UPDATE
router.put('/:id', updateNotification)

//DELETE
router.delete('/:id', deleteAllNotifications)

//GET ALL
router.get('/:receiverId', getAllNotifications)

//COUNT MESSAGES
router.get('/messages/:receiverId', countMessageNotifications)

//CLEAR NEW MESSAGES
router.delete('/messages/:conversationId', deleteNewMessagesNotifications)

export default router
