import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { createError } from '../utils/error.js'

export const createComment = async (req, res, next) => {
  const newComment = new Comment(req.body)
  const { postId } = req.body
  try {
    const currentPost = await Post.findById(postId)
    if (!currentPost) return next(createError(404, 'Post not found!'))

    const savedComment = await newComment.save()
    const commentId = savedComment._id.toString()
    await currentPost.updateOne({ $push: { comments: commentId } })

    res.status(200).json(savedComment)
  } catch (error) {
    next(error)
  }
}

export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (comment.userId === req.body.userId) {
      await comment.updateOne({ $set: req.body })
      res.status(200).json('Post has been updated')
    } else {
      return next(createError(403, 'You can update only your posts'))
    }
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    const postId = comment.postId

    const currentPost = await Post.findById(postId)
    await currentPost.updateOne({ $pull: { comments: req.params.id } })

    await comment.deleteOne()
    res.status(200).json('Post has been deleted')
  } catch (error) {
    next(error)
  }
}

export const getComments = async (req, res, next) => {
  const { limit = 10, page = 1, createdAt = -1, ...rest } = req.query

  try {
    const comments = await Comment.find({ ...rest })
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
    const count = await Comment.countDocuments({ ...rest })

    res.status(200).json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}
