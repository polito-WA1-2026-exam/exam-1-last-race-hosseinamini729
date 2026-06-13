import db from "#src/config/db.js";

export class NetworkService {
  queryAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getNetworkData() {
    try {
      const stations = await this.queryAll("SELECT * FROM stations");
      const lines = await this.queryAll("SELECT * FROM lines");
      const segments = await this.queryAll("SELECT * FROM segments");

      return {
        stations,
        lines,
        segments,
      };
    } catch (error) {
      throw error;
    }
  }
}
