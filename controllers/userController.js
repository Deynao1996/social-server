import User from '../models/User.js'
import CryptoJS from 'crypto-js'
import { createError } from '../utils/error.js'
import { ObjectId } from 'mongodb'

export const updateUser = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const { followers, following, ...rest } = user._doc
    const followingIds = user.following.map((id) => new ObjectId(id))
    const followerIds = user.followers.map((id) => new ObjectId(id))

    const followingUsers = await User.aggregate([
      {
        $match: {
          _id: { $in: followingIds }
        }
      },
      {
        $project: {
          password: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])
    const followerUsers = await User.aggregate([
      {
        $match: {
          _id: { $in: followerIds }
        }
      },
      {
        $project: {
          password: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])
    res.status(200).json({ followingUsers, followerUsers })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('Account has been deleted')
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, isAdmin, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  const currentUserId = req.params.userId
  const filter = new RegExp(req.query.filter || '\\w', 'ig')
  const queryParams = {
    _id: { $ne: currentUserId },
    $or: [{ name: filter }, { lastName: filter }, { username: filter }]
  }

  try {
    const users = await User.find(queryParams)
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  const userIds = req.body.userIds
  const queryParam = userIds ? { _id: { $in: userIds } } : {}
  try {
    const users = await User.find(queryParam)
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const followUser = async (req, res, next) => {
  if (req.body.currentUserId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.currentUserId)

      if (currentUser.following.includes(req.params.id)) {
        return next(createError(403, 'You already have been subscribed'))
      } else {
        await currentUser.updateOne({ $push: { following: req.params.id } })

        await User.findByIdAndUpdate(
          req.params.id,
          {
            $push: { followers: req.body.currentUserId }
          },
          { new: true }
        )
        res.status(200).json('You have been started following user')
      }
    } catch (error) {
      next(error)
    }
  } else {
    return next(createError(403, 'You can not follow yourself'))
  }
}

export const unfollowUser = async (req, res, next) => {
  if (req.body.currentUserId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.currentUserId)

      if (!currentUser.following.includes(req.params.id)) {
        return next(createError(403, 'You are not following this user'))
      } else {
        await currentUser.updateOne({ $pull: { following: req.params.id } })

        await User.findByIdAndUpdate(
          req.params.id,
          {
            $pull: { followers: req.body.currentUserId }
          },
          { new: true }
        )
        res.status(200).json('You have been finished following user')
      }
    } catch (error) {
      next(error)
      res.status(500).json(e)
    }
  } else {
    return next(createError(403, 'You can not unfollow yourself'))
  }
}
