const ApiError = require("../error/api_error");
const pool = require("../pg_config");

class PgService {
  static createMarkerNumeredValues(array = []) {
    return array.map((item, index) => `$${index + 1}`).join(", ");
  }

  static createCondition(condition) {
    let values = [];
    let count = 0;

    const markerCondition = condition
      .split(" ")
      .map((item, index, array) => {
        const mI = array[index - 1];
        const operatorCondition =
          mI === "=" ||
          mI === ">" ||
          mI === "<" ||
          mI === "=<" ||
          mI === ">=" ||
          mI === "!=";
        if (operatorCondition) {
          count++;
          values.push(item);
          return `$${count}`;
        }
        return item;
      })
      .join(" ");
    return [markerCondition, values];
  }

  static async create(tableName, columns, values) {
    try {
      const numeredValues = this.createMarkerNumeredValues(values);
      const request = await pool.query(
        `INSERT INTO ${tableName} (${columns}) VALUES (${numeredValues}) RETURNING *`,
        values
      );
      return request;
    } catch (error) {
      return;
    }
  }

  static async get(tableName, columns, conditionDescription) {
    try {
      const checkColumns = columns === "*" ? "*" : columns.join(", ");
      if (conditionDescription) {
        const [markerCondition, values] = await this.createCondition(
          conditionDescription
        );
        const request = await pool.query(
          `SELECT ${checkColumns} FROM ${tableName} WHERE ${markerCondition}`,
          values
        );
        return request;
      }
      const request = await pool.query(
        `SELECT (${checkColumns}) FROM ${tableName}`
      );
      return request;
    } catch (error) {
      return; 
    }
  }

  static async update(tableName, parametres, conditionDescription) {
    const [queryParametres, values] = await this.createCondition(parametres);
    if (conditionDescription) {
      const [markerCondition, conditionValues] = await this.createCondition(
        conditionDescription
      );
      const request = await pool.query(
        `UPDATE ${tableName} SET ${queryParametres} WHERE ${markerCondition} RETURNING *`,
        [...values, ...conditionValues]
      );

      return request;
    }
    const request = await pool.query(
      `UPDATE ${tableName} SET ${queryParametres}`,
      values
    );
    return request;
  }

  static async delete(tableName, conditionDescription) {
    const [markerCondition, values] = await this.createCondition(
      conditionDescription
    );
    const request = await pool.query(
      `DELETE FROM ${tableName} WHERE ${markerCondition} RETURNING 'ok'`,
      values
    );
    return request;
  }
}

module.exports = PgService;

// function queryf(...a) {
//   console.log(...a);
// }

// PgService.create("user", "email, password", [
//   "ieye@gmail.com",
//   "djfksljfskdjfs",
// ]);

// PgService.get("user", "*", "id = 3 AND email = username");
// PgService.update("user", "id = 3 AND email = username");
// PgService.delete("user", "id = 3 AND email = username");
