import { ErrorCode } from "../../common/enums/error-code.enum";
import {
  LoginDto,
} from "./interface/auth.interface";
import {
  BadRequestException,
  UnauthorizedException
} from "../../common/utils/catch-errors";

import {
  refreshTokenSignOptions,
  RefreshTPayload,
  signJwtToken,
  verifyJwtToken,
} from "../../common/utils/jwt";
import { compareValue } from "../../common/utils/bcrypt";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { calculateExpirationDate, ONE_DAY_IN_MS, thirtyDaysFromNow } from "../../common/utils/date-time";
import { config } from "../../config/app.config";
import { logger } from "../../common/utils/logger";

export class AuthService {

  public async login(loginData: LoginDto) {
    const { username, password, userAgent } = loginData;
    const userService = new UserService();
    logger.info(`Login attempt for username: ${username}`);
    const user = await userService.findByUsername(username);
    
    if (!user) {
      logger.warn(`Login failed: User with username ${username} not found`);
      throw new BadRequestException(
        "Usuario o contraseña incorrecto",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }
    
    if (!user.state) {
      logger.warn(`Login failed: User with username ${username} not found`);
      throw new BadRequestException(
        "Usuario o contraseña incorrecto",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    const isPasswordValid = await compareValue(password, user.password as string);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for username: ${username}`);
      throw new BadRequestException(
        "Usuario o contraseña incorrecto",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    }

    logger.info(`Creating session for user ID: ${user.userId}`);
    const sessionService = new SessionService();
    const userId = Number(user.userId)
    const expiredAt = thirtyDaysFromNow().toISOString();
    const sessionId = await sessionService.create({ userId , userAgent, expiredAt }) as number;

    logger.info(`Signing tokens for user ID: ${user.userId}`);
    const accessToken = signJwtToken({
      userId: String(userId),
      sessionId: sessionId.toString(),
    });

    const refreshToken = signJwtToken(
      {
        sessionId: sessionId.toString(),
      },
      refreshTokenSignOptions
    );

    logger.info(`Login successful for user ID: ${user.userId}`);
    return {
      user,
      accessToken,
      refreshToken
    };
  }

  public async refreshToken(refreshToken: string) {
    const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    
    const sessionService = new SessionService()
    const session = await sessionService.findById(Number(payload.sessionId));
    const now = Date.now();

    if (!session) {
      throw new UnauthorizedException("Session does not exist");
    }
    const expiredAtDate = new Date(session.expiredAt);
    const expiredAtTime = expiredAtDate.getTime();
    if (expiredAtTime <= now) {
      throw new UnauthorizedException("Session expired");
    }

    const sessionRequireRefresh =
    expiredAtTime - now <= ONE_DAY_IN_MS;

    if (sessionRequireRefresh) {
      session.expiredAt = calculateExpirationDate(
        config.JWT.REFRESH_EXPIRES_IN
      );
       await sessionService.findById(Number(payload.sessionId));
    }

    const newRefreshToken = sessionRequireRefresh
      ? signJwtToken(
          {
            sessionId: (session.sessionId).toString(),
          },
          refreshTokenSignOptions
        )
      : undefined;

    const accessToken = signJwtToken({
      userId: (session.userId).toString(),
      sessionId: (session.sessionId).toString(),
    });

    return {
      accessToken,
      newRefreshToken,
    };
  }

  public async logout(sessionId: number) {
    const sessionService = new SessionService()
    return await sessionService.deleteById(sessionId);
  }

}

