const usersRoutes = require("./users.routes");
const foldersRoutes = require("./folders.routes");
const notesRoutes = require("./notes.routes");
const areasRoutes = require("./areas.routes");

const routes = [usersRoutes, foldersRoutes, notesRoutes, areasRoutes];

module.exports = routes;
