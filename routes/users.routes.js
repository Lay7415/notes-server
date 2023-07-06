const {Router} = require('express')

const usersRouter = Router()

usersRouter.post('/registration')
usersRouter.post('/login')
usersRouter.get('/refresh')
usersRouter.post('/logout')

module.exports = usersRouter