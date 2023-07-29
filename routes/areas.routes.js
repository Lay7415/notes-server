const { Router } = require("express");
const areaController = require("../controllers/area.controller");
const authorization = require("../middlewares/authorization_middleware");

const areasRouter = Router();

areasRouter.post("/areas", authorization, areaController.createArea);
areasRouter.get("/areas", authorization, areaController.getAreas);
areasRouter.delete("/areas/:id", authorization, areaController.deleteArea);

module.exports = areasRouter;
