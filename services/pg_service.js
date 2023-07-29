const pool = require("../pg_config");

class PgService {
  static textSpaceRemover(...texts) {
    return texts.map((text) => {
      return text.split(" ").join("_");
    });
  }

  static request(query) {
    try {
      let count = 0;
      let values = [];
      const regex = /#(.*?)#/g;
      const queryText = query
        .split(" ")
        .map((item, index) => {
          if (regex.test(item)) {
            count++;
            values.push(item.split("#")[1].split("_").join(" "));
            return `$${count}`;
          }
          return item;
        })
        .join(" ");
      console.log(queryText, values);
      const request = pool.query(queryText, values);
      return request;
    } catch (error) {
      return;
    }
  }
}

module.exports = PgService;
