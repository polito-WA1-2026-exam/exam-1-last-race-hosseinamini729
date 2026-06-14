export class GameController {
  constructor(gameService) {
    this.gameService = gameService;
  }

  async start(req, res, next) {
    try {
      const data = await this.gameService.startGame();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async play(req, res, next) {
    try {
      const { startStationId, endStationId, segments } = req.body;
      const userId = req.user.id;
      const result = await this.gameService.playGame(
        userId,
        startStationId,
        endStationId,
        segments,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async ranking(req, res, next) {
    try {
      const data = await this.gameService.getRanking();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
