const ApiError = require("../error/api_error");
const PgService = require("../services/pg_service");

class AreaController {
  async createArea(req, res, next) {
    const { user_id } = req.user;
    const [area_name] = PgService.textSpaceRemover(req.body.area_name);
    if (!user_id || !req.body.area_name) {
      ApiError.internal("не все данные переданы");
    }

    const area = await PgService.request(
      `INSERT INTO areas ( area_name, user_id ) VALUES ( #${area_name}# , #${user_id}# ) RETURNING *`
    );
    if (!area) {
      return next(
        ApiError.internal("рабочее пространство с таким именем уже существует")
      );
    }

    res.json({ newArea: area?.rows[0] });
  }

  async getAreas(req, res, next) {
    const { user_id } = req.user;
    if (!user_id) {
      ApiError.internal("не все данные переданы");
    }
    const areas = await PgService.request(
      `SELECT * FROM areas WHERE user_id = #${user_id}#`
    );
    if (!areas) {
      return next(ApiError.internal("рабочие пространства не нашлись"));
    }
    res.json({ areas: areas?.rows });
  }

  async deleteArea(req, res, next) {
    const { user_id } = req.user;
    const { id } = req.params;

    if (!user_id || !id) {
      ApiError.internal("не все данные переданы");
    }

    const notes = await PgService.request(
      `DELETE FROM notes WHERE user_id = #${user_id}# AND area_id = #${id}# `
    );

    const folders = await PgService.request(
      `DELETE FROM folders WHERE user_id = #${user_id}# AND area_id = #${id}# `
    );

    const areas = await PgService.request(
      `DELETE FROM areas WHERE user_id = #${user_id}# AND id = #${id}# `
    );

    if (!areas.rowCount && !folders.rowCount && !notes.rowCount) {
      return next(ApiError.internal("ошибка при удалении"));
    }

    res.json({ message: "рабочее пространство было удалено" });
  }
}

module.exports = new AreaController();
