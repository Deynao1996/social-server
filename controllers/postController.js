import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
import { createError } from '../utils/error.js'
import { encodeImage } from '../utils/encodeImage.js'
import mongoose from 'mongoose'

export const createPost = async (req, res, next) => {
  const { media, ...rest } = req.body
  const newPost = new Post(rest)

  try {
    if (req.body.mediaType === 'image') {
      const blurHashImage = await encodeImage(media)
      newPost.media.blurhash = blurHashImage
    }
    newPost.media.src = media
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json('Post has been updated')
    } else {
      return next(createError(403, 'You can update only your posts'))
    }
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to delete posts in demo mode'
        )
      )
    }

    const post = await Post.findById(req.params.id)
    await Comment.deleteMany({ postId: req.params.id })
    await post.deleteOne()
    res.status(200).json('Post has been deleted')
  } catch (error) {
    next(error)
  }
}

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } })
      res.status(200).json('You disliked this post')
    } else {
      await post.updateOne({ $push: { likes: req.body.userId } })
      res.status(200).json('Post has been licked')
    }
  } catch (error) {
    next(error)
  }
}

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'users',
          let: { user_id: { $toObjectId: '$userId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
            { $project: { _id: 0, name: 1, lastName: 1, profilePicture: 1 } }
          ],
          as: 'userInfo'
        }
      }
    ])
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

// export const getTimeline = async (req, res, next) => {
//   const {
//     userId,
//     limit = 10,
//     page = 1,
//     createdAt = -1,
//     tags,
//     ...rest
//   } = req.query
//   const filter = new RegExp(tags, 'ig')

//   try {
//     const user = await User.findOne({ _id: userId })
//     const timelineQuery = {
//       $or: [{ userId: userId }, { userId: { $in: user.following } }],
//       tags: filter,
//       ...rest
//     }

//     const timeline = await Post.find(timelineQuery)
//       .sort({ createdAt })
//       .limit(limit)
//       .skip((page - 1) * limit)
//     const count = await Post.countDocuments(timelineQuery)

//     res.status(200).json({
//       timeline,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page
//     })
//   } catch (error) {
//     next(error)
//   }
// }

export const getTimeline = async (req, res, next) => {
  const {
    userId,
    limit = 10,
    page = 1,
    createdAt = -1,
    tags,
    skipCurrentUser,
    ...rest
  } = req.query
  const filter = new RegExp(tags, 'ig')

  try {
    const user = await User.findOne({ _id: userId })
    const timelineQuery = {
      $or: [
        { userId: userId },
        { userId: { $in: !!skipCurrentUser ? [] : user.following } }
      ],
      tags: filter,
      ...rest
    }

    const timeline = await Post.aggregate([
      { $match: timelineQuery },
      { $sort: { createdAt } },
      { $skip: (+page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          let: { user_id: { $toObjectId: '$userId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
            { $project: { _id: 0, name: 1, lastName: 1, profilePicture: 1 } }
          ],
          as: 'userInfo'
        }
      }
    ])

    const count = await Post.countDocuments(timelineQuery)
    res.status(200).json({
      timeline,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}
