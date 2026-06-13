import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller.js";

export class AuthModule {
  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/auth/login", (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info);

        req.login(user, (err) => {
          if (err) return next(err);
          return this.controller.login(req, res);
        });
      })(req, res, next);
    });

    this.router.delete(
      "/auth/current",
      this.controller.logout.bind(this.controller),
    );

    this.router.get(
      "/auth/current",
      this.controller.getCurrentUser.bind(this.controller),
    );
  }
}
