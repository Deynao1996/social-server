import express from 'express'
import {
  createComment,
  deleteComment,
  getComments,
  updateComment
} from '../controllers/commentController.js'

const router = express.Router()

//Create comment
router.post('/', createComment)

//Update comment
router.put('/:id', updateComment)

//Delete comment
router.delete('/:id', deleteComment)

//Get comments
router.get('/', getComments)

export default router
