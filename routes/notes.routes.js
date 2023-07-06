const {Router} = require('express')

const notesRouter = Router()

notesRouter.post('/notes')
notesRouter.get('/notes')
notesRouter.get('/notes/:id')
notesRouter.put('/notes')
notesRouter.delete('/notes/:id')

module.exports = notesRouter