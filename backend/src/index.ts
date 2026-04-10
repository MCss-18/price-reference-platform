import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/app.config";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./middlewares/passport";
import authRoutes from "./modules/auth/auth.routes";
import sessionRoutes from "./modules/session/session.routes";
import { authenticateJWT } from "./common/strategies/jwt.strategy";
import path from "path";
import userRoutes from "./modules/user/user.routes";
import purchasesRoutes from "./modules/purchases/purchases.routes";
import productRoutes from "./modules/products/product.router";
import serviceRoutes from "./modules/services/service.router";

const app = express()
const BASE_PATH = config.BASE_PATH;

app.use(cookieParser());
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());

// Private routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);
app.use(`${BASE_PATH}/users`, userRoutes);

app.use(authenticateJWT);
app.use(`${BASE_PATH}/products`, productRoutes);
app.use(`${BASE_PATH}/services`, serviceRoutes);
app.use(`${BASE_PATH}/purchases`, purchasesRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
});

export default app;