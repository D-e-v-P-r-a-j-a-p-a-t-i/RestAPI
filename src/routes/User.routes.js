const { welcomeUser, addUser, authUser } = require('../controllers/User.controller')

const userRouter = require('express').Router()

userRouter.get('', welcomeUser)
userRouter.post('/addUser', addUser)
userRouter.post('/login', authUser)

module.exports = userRouter