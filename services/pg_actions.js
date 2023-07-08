const pool = require("../pg_config");

class PgService {
  static createMarkerNumeredValues(array = []) {
    try {
      return array.map((item, index) => `$${index + 1}`).join(", ");
    } catch (error) {
      throw new Error(error);
    }
  }

  static createCondition(condition) {
    try {
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
    } catch (error) {
      throw new Error(error);
    }
  }

  static async create(tableName, columns, values) {
    try {
      const numeredValues = this.createMarkerNumeredValues(values);
      const request = await pool.query(
        `INSERT INTO ${tableName} (${columns}) VALUES (${numeredValues})`,
        values
      );
      return request;
    } catch (error) {
      throw new Error(error);
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
      const request = await pool.query(`SELECT (${checkColumns}) FROM ${tableName}`);
      return request;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(tableName, parametres, conditionDescription) {
    try {
      const [queryParametres, values] = await this.createCondition(parametres);
      if (conditionDescription) {
        const [markerCondition, conditionValues] = await this.createCondition(
          conditionDescription
        );
        const request = await pool.query(
          `UPDATE ${tableName} SET ${queryParametres} WHERE ${markerCondition}`,
          [...values, ...conditionValues]
        );

        return request;
      }
      const request = await pool.query(
        `UPDATE ${tableName} SET ${queryParametres}`,
        values
      );
      return request;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(tableName, conditionDescription) {
    try {
      const [markerCondition, values] = await this.createCondition(
        conditionDescription
      );
      const request = await pool.query(
        `DELETE FROM ${tableName} WHERE ${markerCondition}`,
        values
      );
      return request;
    } catch (error) {
      throw new Error(error);
    }
  }
}

// PgService.create("user", "email, password", [
//   "ieye@gmail.com",
//   "djfksljfskdjfs",
// ]);

// PgService.get("user", "*", "id = 3 AND email = username");
// PgService.update("user", "id = 3 AND email = username");
// PgService.delete("user", "id = 3 AND email = username");
