const {Router} = require('express')
const folderController = require('../controllers/folder.controller')

const foldersRouter = Router()

foldersRouter.post('/folders', folderController.createFolder)
foldersRouter.get('/folders', folderController.getFolders)
foldersRouter.get('/folders/:id', folderController.getFolder)
foldersRouter.put('/folders', folderController.changeFolder)
foldersRouter.delete('/folders/:id', folderController.deleteFolder)

module.exports = foldersRouter