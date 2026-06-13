import db from "#src/config/db.js";
import bcrypt from "bcrypt";

export class AuthService {
  async validateUser(username, password) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (err) return reject(err);
          if (!user) return resolve(null);

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return reject(err);
            if (!isMatch) return resolve(null);

            resolve(user);
          });
        },
      );
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT id, username FROM users WHERE id = ?",
        [id],
        (err, user) => {
          if (err) return reject(err);
          resolve(user);
        },
      );
    });
  }
}
