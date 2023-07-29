const { Router } = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authorizationMiddleware = require("../middlewares/authorization_middleware");

const usersRouter = Router();

usersRouter.post(
  "/user/registration",
  [
    body("email").isEmail().withMessage("Неверный формат электронной почты"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Пароль должен содержать минимум 6 символов"),
  ],
  userController.registration
);

usersRouter.post(
  "/user/login",
  [
    body("email").isEmail().withMessage("Неверный формат электронной почты"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Пароль должен содержать минимум 6 символов"),
  ],
  userController.login
);

usersRouter.get("/user/refresh",authorizationMiddleware, userController.refresh);
usersRouter.delete('/user/delete',authorizationMiddleware, userController.deleteAccount)

module.exports = usersRouter;
