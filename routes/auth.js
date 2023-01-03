import express from 'express'
import {
  loginUser,
  registerUser,
  loginWithJWT
} from '../controllers/authController.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

// Register user
router.post('/register', registerUser)

//Login user
router.post('/login', loginUser)

//Login user with JWT
router.get('/login/withToken', verifyToken, loginWithJWT)

export default router
