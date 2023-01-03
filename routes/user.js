import express from 'express'
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  getFollowers,
  unfollowUser,
  followUser,
  getUsers
} from '../controllers/userController.js'

const router = express.Router()

//Update user
router.put('/:id', updateUser)

//Get followers
router.get('/friends/:userId', getFollowers)

//Delete user
router.delete('/delete/:id', deleteUser)

//Get user
router.get('/:id', getUser)

//Get all users
router.get('/get-all/:userId', getAllUsers)

//Get users
router.post('/', getUsers)

//Follow user
router.put('/follow/:id', followUser)

//Unfollow user
router.put('/unfollow/:id', unfollowUser)

export default router
