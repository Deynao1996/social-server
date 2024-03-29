import CryptoJS from 'crypto-js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { createError } from '../utils/error.js'

export const registerUser = async (req, res, next) => {
  const { username, email, password, name, lastName } = req.body
  const newUser = new User({
    username,
    email,
    name,
    lastName,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString()
  })

  try {
    const existingEmail = await User.findOne({ email })
    const existingUserName = await User.findOne({ username })

    if (existingEmail || existingUserName) {
      return next(createError(400, 'This user already exist'))
    }

    const createdUser = await newUser.save()
    res.status(200).json(createdUser)
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  const { email, password: qPassword } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return next(createError(401, 'Wrong credentials'))
    }

    const { password, ...rest } = user._doc
    const hashedPassword = CryptoJS.AES.decrypt(password, process.env.PASS_SEC)
    const stringPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    if (qPassword !== stringPassword) {
      return next(createError(401, 'Wrong credentials'))
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        password: stringPassword
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    )

    res.status(200).json({ ...rest, accessToken })
  } catch (error) {
    next(error)
  }
}

export const loginWithJWT = async (req, res, next) => {
  const { email, password: passwordJWT } = req.user
  const accessToken = req.token
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return next(createError(401, 'Wrong credentials'))
    }

    const { password, ...rest } = user._doc
    const hashedPassword = CryptoJS.AES.decrypt(password, process.env.PASS_SEC)
    const stringPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

    if (passwordJWT !== stringPassword) {
      return next(createError(401, 'Wrong credentials'))
    }

    res.status(200).json({ ...rest, accessToken })
  } catch (error) {
    next(error)
  }
}
