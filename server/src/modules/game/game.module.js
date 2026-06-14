import { Router } from "express";
import { GameController } from "./game.controller.js";
import { GameService } from "./game.service.js";

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
    // Apply the authentication middleware to all routes under /game
    this.router.use("/game", this.checkAuth);

    this.router.get("/game/start", (req, res, next) =>
      this.controller.start(req, res, next),
    );
    this.router.post("/game/play", (req, res, next) =>
      this.controller.play(req, res, next),
    );
    this.router.get("/game/ranking", (req, res, next) =>
      this.controller.ranking(req, res, next),
    );
  }
}
