const {Router} = require('express')
const noteController = require('../controllers/note.controller')

const notesRouter = Router()

notesRouter.post('/notes', noteController.createNote)
notesRouter.get('/notes', noteController.getNotes)
notesRouter.get('/notes/:id', noteController.getNote)
notesRouter.put('/notes', noteController.changeNote)
notesRouter.delete('/notes/:id', noteController.deleteNote)

module.exports = notesRouter