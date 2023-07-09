const JWTService = require("../services/jwt_service");
const PgService = require("../services/pg_service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const ApiError = require("../error/api_error");

class UserController {
  async registration(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("введен неправильный пароль или email"));
    }
    const { email, password } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await PgService.create("users", "email, password", [
      email,
      hashedPassword,
    ]);
    if (!newUser) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const user_id = newUser.rows[0].id;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async login(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("введен неправильный пароль или email"));
    }
    const { email, password } = req.body;
    const foundUser = await PgService.get("users", "*", `email = ${email}`);
    console.log(foundUser);
    const userPassword = foundUser.rows[0].password;
    const comparePassword = bcrypt.compareSync(password, userPassword);
    if (!comparePassword) {
      return next(ApiError.badRequest("введен неправильный пароль"));
    }
    const user_id = foundUser.rows[0].id;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async refresh(req, res, next) {
    const user_id = req.user.user_id;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }
}

module.exports = new UserController();
