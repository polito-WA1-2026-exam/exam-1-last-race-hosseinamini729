import { Router } from "express";
import { GameController } from "./game.controller.js";
import { GameService } from "./game.service.js";

import { body } from "express-validator";
import { validateRequest } from "#src/middlewares/validate.middleware.js";

export class GameModule {
  constructor() {
    this.router = Router();
    this.service = new GameService();
    this.controller = new GameController(this.service);
    this.initializeRoutes();
  }

  checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Not authenticated." });
  }

  initializeRoutes() {
    this.router.use("/game", this.checkAuth);

    this.router.get("/game/start", (req, res, next) =>
      this.controller.start(req, res, next),
    );
    this.router.post(
      "/game/play",
      [
        body("startStationId")
          .exists()
          .withMessage("Start Station ID is required.")
          .isInt({ min: 1 })
          .withMessage("Start Station ID must be a valid positive integer.")
          .toInt(),

        body("endStationId")
          .exists()
          .withMessage("End Station ID is required.")
          .isInt({ min: 1 })
          .withMessage("End Station ID must be a valid positive integer.")
          .toInt(),

        body("segments")
          .exists()
          .withMessage("Segments data is required.")
          .isArray()
          .withMessage("Segments must be an array of IDs."),

        body("segments.*")
          .isInt({ min: 1 })
          .withMessage("Every segment ID must be a positive integer.")
          .toInt(),
      ],

      validateRequest,
      (req, res, next) => this.controller.play(req, res, next),
    );
    this.router.get("/game/ranking", (req, res, next) =>
      this.controller.ranking(req, res, next),
    );
  }
}
