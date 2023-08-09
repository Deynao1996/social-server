import Notification from '../models/Notification.js'
import { createError } from '../utils/error.js'

export const createNotification = async (req, res, next) => {
  const newNotification = new Notification(req.body)

  try {
    await newNotification.save()
    res.status(200).json('Notification has been created')
  } catch (error) {
    next(error)
  }
}

export const updateNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json('Notification has been updated!')
  } catch (error) {
    next(error)
  }
}

export const deleteAllNotifications = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to clear notifications in demo mode'
        )
      )
    }

    await Notification.deleteMany({
      receiverId: req.params.id,
      type: { $ne: 'new-message' }
    })
    res.status(200).json('Notifications have been removed')
  } catch (error) {
    next(error)
  }
}

export const deleteNewMessagesNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({
      type: 'new-message',
      meta: { conversationId: req.params.conversationId }
    })
    res.status(200).json('Notifications have been removed')
  } catch (error) {
    next(error)
  }
}

export const getAllNotifications = async (req, res, next) => {
  const { receiverId } = req.params
  const { ...queryParams } = req.query

  try {
    const notifications = await Notification.aggregate([
      { $match: { receiverId, ...queryParams } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          let: { user_id: { $toObjectId: '$senderId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
            { $project: { _id: 0, name: 1, lastName: 1, profilePicture: 1 } }
          ],
          as: 'userInfo'
        }
      }
    ])

    res.status(200).json(notifications)
  } catch (error) {
    next(error)
  }
}

export const countMessageNotifications = async (req, res, next) => {
  const { receiverId } = req.params

  try {
    const newMessagesCount = await Notification.countDocuments({
      type: 'new-message',
      receiverId
    })
    res.status(200).json({ newMessagesCount })
  } catch (error) {
    next(error)
  }
}

export const getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById({
      receiverId: req.params.id
    })
    res.status(200).json(notification)
  } catch (error) {
    next(error)
  }
}

// export const sendNotification = async (req, res, next) => {
//   try {
//     const receiver = await User.findById(req.params.id)

//     if (!receiver.messageNotifications.includes(req.body.userId)) {
//       await receiver.updateOne({
//         $push: { messageNotifications: req.body.userId }
//       })
//       res.status(200).json('Notification has been sended')
//     } else {
//       res.status(200).json('Receiver is online')
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// export const clearNotification = async (req, res, next) => {
//   try {
//     const currentUser = await User.findById(req.params.id)
//     if (!currentUser.messageNotifications.includes(req.body.userId)) {
//       return next(
//         createError(403, 'You do not have any notification from this friend')
//       )
//     } else {
//       await currentUser.updateOne({
//         $pull: { messageNotifications: req.body.userId }
//       })
//       res.status(200).json('You have been finished following user')
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// export const getNotification = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id)
//     const { messageNotifications } = user._doc
//     res.status(200).json(messageNotifications)
//   } catch (error) {
//     next(error)
//   }
// }
