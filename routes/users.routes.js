const {Router} = require('express')
const userController = require('../controllers/user.controller')

const usersRouter = Router()

usersRouter.post('/user/registration', userController.registration)
usersRouter.post('/user/login', userController.login)
usersRouter.get('/user/refresh', userController.refresh)
usersRouter.post('/user/logout', userController.logout)

module.exports = usersRouter