import { Router } from "express";
import { NetworkController } from "./network.controller.js";
import { NetworkService } from "./network.service.js";

export class NetworkModule {
  constructor() {
    this.router = Router();
    this.service = new NetworkService();
    this.controller = new NetworkController(this.service);
    this.initializeRoutes();
  }

  checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({
      error: "Not authenticated. Only registered users can view the map.",
    });
  }

  initializeRoutes() {
    this.router.get("/network", this.checkAuth, (req, res, next) =>
      this.controller.getNetwork(req, res, next),
    );
  }
}
