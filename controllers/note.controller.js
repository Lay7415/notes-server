const ApiError = require("../error/api_error");
const PgService = require("../services/pg_service");

class NoteController {
  async createNote(req, res, next) {
    const { user_id } = req.user;
    const { note, path, area_id, text } = req.body;

    if (!user_id || !note || !path || !area_id || !text) {
      ApiError.internal("не все данные переданы");
    }

    const [noteValue, pathValue, textValue] = await PgService.textSpaceRemover(
      note,
      path,
      text
    );
    const newNote = await PgService.request(
      `INSERT INTO notes ( note, path, area_id, user_id, text ) VALUES ( #${noteValue}# , #${pathValue}# , #${area_id}# , #${user_id}# , #${textValue}# ) RETURNING *`
    );

    if (!newNote) {
      return next(ApiError.badRequest("такая папка уже сужествует"));
    }
    return res.json({ newNote: newNote.rows[0] });
  }

  async getNotes(req, res, next) {
    const { id } = req.params;
    const { user_id } = req.user;

    if (!user_id || !id) {
      ApiError.internal("не все данные переданы");
    }

    const note = await PgService.request(
      `SELECT * FROM notes WHERE area_id = #${id}# AND user_id = #${user_id}#`
    );

    if (!note) {
      return next(ApiError.badRequest("такая папка не сужествует"));
    }
    return res.json({ newNote: note.rows });
  }

  async deleteNote(req, res, next) {
    const { user_id } = req.user;
    const { area_id, id } = req.query;

    if (!user_id || !id || !area_id) {
      ApiError.internal("не все данные переданы");
    }

    const note = await PgService.request(
      `DELETE FROM notes WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND id = #${id}#`
    );
    if (!note.rowCount) {
      return next(ApiError.internal("ошибка при удалении"));
    }
    return res.json({ message: "уделение успешно" });
  }

  async changeNote(req, res, next) {
    const { user_id } = req.user;
    const { note, path, area_id, text, id } = req.body;

    if (!user_id || !note || !path || !area_id || !text || !id) {
      ApiError.internal("не все данные переданы");
    }

    const [noteValue, pathValue, textValue] = await PgService.textSpaceRemover(
      note,
      path,
      text
    );

    const updatedNote = await PgService.request(
      `UPDATE notes SET note = #${noteValue}# , path = #${pathValue}# , text = #${textValue}# WHERE area_id = #${area_id}# AND user_id = #${user_id}# AND id = #${id}# RETURNING *`
    );

    if (!updatedNote) {
      return next(ApiError.internal("ошибка при изменение имени"));
    }

    return res.json({
      updatedNote: {
        ...updatedNote.rows[0],
        path: path,
      },
    });
  }
}

module.exports = new NoteController();
