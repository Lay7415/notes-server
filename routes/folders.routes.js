const {Router} = require('express')

const foldersRouter = Router()

foldersRouter.post('/notes')
foldersRouter.get('/notes')
foldersRouter.get('/notes/:id')
foldersRouter.put('/notes')
foldersRouter.delete('/notes/:id')

module.exports = foldersRouter