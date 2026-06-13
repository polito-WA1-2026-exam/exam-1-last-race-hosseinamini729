export class AuthController {
  login(req, res) {
    return res.status(200).json({
      id: req.user.id,
      username: req.user.username,
    });
  }

  logout(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  }

  getCurrentUser(req, res) {
    if (req.isAuthenticated()) {
      res.status(200).json({
        id: req.user.id,
        username: req.user.username,
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  }
}
