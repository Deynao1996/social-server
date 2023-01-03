import express from 'express'
import {
  createPost,
  deletePost,
  getPost,
  getTimeline,
  likePost,
  updatePost
} from '../controllers/postController.js'

const router = express.Router()

//Create post
router.post('/create', createPost)

//Update post
router.put('/update/:id', updatePost)

//Delete post
router.delete('/delete/:id', deletePost)

//Like / Dislike post
router.put('/like/:id', likePost)

//Get post
router.get('/:id', getPost)

//Get timeline
router.get('/', getTimeline)

export default router
