const usersRoutes = require('./users.routes')
const foldersRoutes = require('./folders.routes')
const notesRoutes = require('./notes.routes')

const routes = [usersRoutes, foldersRoutes, notesRoutes]

module.exports = routes