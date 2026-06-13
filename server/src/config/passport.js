import LocalStrategy from "passport-local";
import { AuthService } from "#src/modules/auth/auth.service.js";

export function configurePassport(passport) {
  const authService = new AuthService();

  // Login strategy
  passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
      try {
        const user = await authService.validateUser(username, password);

        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }),
  );

  // Saving Id in session token
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  // Getting user id from session token
  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await authService.getUserById(id);
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  });
}
