const { Router } = require("express");
const noteController = require("../controllers/note.controller");
const authorization = require("../middlewares/authorization_middleware");

const notesRouter = Router();

notesRouter.post("/notes", authorization, noteController.createNote);
notesRouter.get("/notes/:id", authorization, noteController.getNotes);
notesRouter.put("/notes", authorization, noteController.changeNote);
notesRouter.delete("/notes", authorization, noteController.deleteNote);

module.exports = notesRouter;
