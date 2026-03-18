import { getEnv } from "../common/utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  DB: {
    DB_HOST: getEnv("DB_HOST"),
    DB_DATABASE: getEnv("DB_DATABASE"),
    DB_USER: getEnv("DB_USER"),
    DB_PASSWORD: getEnv("DB_PASSWORD"),
    DB_PORT: getEnv("DB_PORT"),
  },
  JWT: {
    SECRET: getEnv("JWT_PRIVATE_KEY"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
    REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },
  DB_USER_MS: getEnv("DB_USER_MS"),
  DB_PASS_MS: getEnv("DB_PASS_MS"),
  DB_NAME_MS: getEnv("DB_NAME_MS"),
  DB_HOST_MS: getEnv("DB_HOST_MS")
});

export const config = appConfig();