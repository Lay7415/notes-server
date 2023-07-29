const ApiError = require("../error/api_error");
const PgService = require("../services/pg_service");

class FolderController {
  async createFolder(req, res, next) {
    const { user_id } = req.user;
    const { name, path, area_id } = req.body;

    if (!user_id || !name || !path || !area_id) {
      ApiError.internal("не все данные переданы");
    }

    const [nameValue, pathValue] = PgService.textSpaceRemover(name, path);
    if (pathValue !== "/") {
      const foundFolder = await PgService.request(
        `SELECT * FROM folders WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND path = #${pathValue}#`
      );
      if (!foundFolder) {
        return next(ApiError.badRequest("такая папка уже сужествует"));
      }
    }
    const newFolder = await PgService.request(
      `INSERT INTO folders ( name, path, area_id, user_id ) VALUES ( #${nameValue}# , #${pathValue}# , #${area_id}# , #${user_id}# ) RETURNING *`
    );

    if (!newFolder) {
      return next(ApiError.internal("ошибка при создании"));
    }
    return res.json({ newFolder: newFolder.rows[0] });
  }

  async getFolders(req, res, next) {
    const { id } = req.params;
    const { user_id } = req.user;

    if (!user_id || !id) {
      ApiError.internal("не все данные переданы");
    }

    const folder = await PgService.request(
      `SELECT * FROM folders WHERE area_id = #${id}# AND user_id = #${user_id}#`
    );

    if (!folder) {
      return next(ApiError.badRequest("такая папка не сужествует"));
    }
    return res.json({ newFolder: folder.rows });
  }

  async deleteFolder(req, res, next) {
    const { user_id } = req.user;
    const { area_id, path, id } = req.query;

    if (!user_id || !path || !area_id) {
      ApiError.internal("не все данные переданы");
    }

    const [pathValue] = PgService.textSpaceRemover(path);

    const folder = await PgService.request(
      `DELETE FROM folders WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND id = #${id}# `
    );
    const folders = await PgService.request(
      `DELETE FROM folders WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND path LIKE #${pathValue}%# `
    );
    const notes = await PgService.request(
      `DELETE FROM notes WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND path LIKE #${pathValue}%# `
    );
    if (
      folder.rowCount !== 1 &&
      folders.rowCount !== 1 &&
      notes.rowCount !== 1
    ) {
      return next(ApiError.internal("ошибка при удалении"));
    }
    res.json({ message: "папка была удалена" });
  }

  async changeFolder(req, res, next) {
    const { user_id } = req.user;
    const { name, path, area_id, id, initialPath, initialName } = req.body;

    if (
      !user_id ||
      !name ||
      !path ||
      !area_id ||
      !id ||
      !initialPath ||
      !initialName
    ) {
      ApiError.internal("не все данные переданы");
    }

    const [nameValue, pathValue, initialPathValue, initialNameValue] =
      PgService.textSpaceRemover(name, path, initialPath, initialName);

    const prevPath =
      initialPath === "/"
        ? "/" + initialNameValue
        : initialPathValue + "/" + initialNameValue;

    const currPath =
      pathValue === "/" ? "/" + nameValue : pathValue + "/" + nameValue;

    const pathes = await PgService.request(
      `UPDATE folders SET path = REPLACE(path, #${prevPath}# , #${currPath}# ) WHERE path LIKE #${prevPath}%# AND area_id = #${area_id}# AND user_id = #${user_id}# RETURNING *`
    );
    if (!pathes) {
      return next(ApiError.internal("ошибка изменении пути"));
    }

    const updatedFolder = await PgService.request(
      `UPDATE folders SET name = #${nameValue}# , path = #${pathValue}# WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND id = #${id}# RETURNING *`
    );

    if (!updatedFolder) {
      return next(ApiError.internal("ошибка при изменение имени"));
    }

    return res.json({
      updatedFolder: {
        ...updatedFolder.rows[0],
        path: path,
      },
    });
  }
}

module.exports = new FolderController();
