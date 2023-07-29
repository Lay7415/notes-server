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
    const newUser = await PgService.request(
      `INSERT INTO users ( email , password ) VALUES ( #${email}# , #${hashedPassword}# ) RETURNING *`
    );

    if (!newUser) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const user_id = newUser?.rows[0]?.id;
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
    const foundUser = await PgService.request(
      `SELECT * FROM users WHERE email = #${email}#`
    );
    if (!foundUser || foundUser.rows.length === 0) {
      return next(ApiError.badRequest("пользователь не найден!"));
    }
    const userPassword = foundUser?.rows[0].password;
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
    const { user_id } = req.user;
    const token = await JWTService.create({ user_id }, { expiresIn: "1h" });
    if (!token) {
      return next(ApiError.internal("ошибка с токеном"));
    }
    res.json({ token });
  }

  async deleteAccount(req, res) {
    const { user_id } = req.user;
    if (!user_id) {
      ApiError.internal("не все данные переданы");
    }

    const notes = await PgService.request(
      `DELETE FROM notes WHERE user_id = #${user_id}# `
    );

    const folders = await PgService.request(
      `DELETE FROM folders WHERE user_id = #${user_id}# `
    );

    const areas = await PgService.request(
      `DELETE FROM areas WHERE user_id = #${user_id}# `
    );

    const users = await PgService.request(
      `DELETE FROM users WHERE id = #${user_id}# `
    );

    if (!areas.rowCount && !folders.rowCount && !notes.rowCount && !users) {
      return next(ApiError.internal("ошибка при удалении аккаунта"));
    }

    res.json({ message: "аккаунт был успешно удален!" });
  }
}

module.exports = new UserController();
