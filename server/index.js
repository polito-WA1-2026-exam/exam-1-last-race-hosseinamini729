import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";

import { configurePassport } from "#src/config/passport.js";
import { AuthModule } from "#src/modules/auth/auth.module.js";
import { NetworkModule } from "#src/modules/network/network.module.js";

const app = express();
const port = 3001;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: "@%#REFC*XU&(_ WVCHWHfahw3eaweh1",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.authenticate("session"));
configurePassport(passport);

const authModule = new AuthModule();
const networkModule = new NetworkModule();

app.use("/api", authModule.router, networkModule.router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Handling 404 errors
app.use((req, res, next) => {
  const error = new Error("Endpoint not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});
