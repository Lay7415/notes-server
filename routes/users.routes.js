const {Router} = require('express')
const userController = require('../controllers/user.controller')

const usersRouter = Router()

usersRouter.post('/registration', userController.registration)
usersRouter.post('/login', userController.login)
usersRouter.get('/refresh', userController.refresh)
usersRouter.post('/logout', userController.logout)

module.exports = usersRouter