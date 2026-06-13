export class NetworkController {
  constructor(networkService) {
    this.networkService = networkService;
  }

  async getNetwork(req, res, next) {
    try {
      const data = await this.networkService.getNetworkData();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
