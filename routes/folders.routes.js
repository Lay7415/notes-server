const { Router } = require("express");
const folderController = require("../controllers/folder.controller");
const authorization = require("../middlewares/authorization_middleware");

const foldersRouter = Router();

foldersRouter.post("/folders", authorization, folderController.createFolder);
foldersRouter.get("/folders/:id", authorization, folderController.getFolders);
foldersRouter.put("/folders", authorization, folderController.changeFolder);
foldersRouter.delete(
  "/folders",
  authorization,
  folderController.deleteFolder
);

module.exports = foldersRouter;
