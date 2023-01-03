import jwt from 'jsonwebtoken'
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return next(createError(403, 'Token is not valid'))

      req.user = user
      req.token = token
      next()
    })
  } else {
    return next(createError(401, 'You are not authenticated'))
  }
}

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'You are not allowed to do that'))
    }
  })
}

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'You are not allowed to do that'))
    }
  })
}
