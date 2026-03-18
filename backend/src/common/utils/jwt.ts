import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { config } from "../../config/app.config";

export type AccessTPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTPayload = {
  sessionId: string;
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN as unknown as number,
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN as unknown as number,
  secret: config.JWT.REFRESH_SECRET,
};

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options: SignOptsAndSecret = accessTokenSignOptions
) => {
  const { secret, ...opts } = options;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret?: string }
) => {
  try {
    const { secret = config.JWT.SECRET, ...opts } = options ?? {};
    const normalizedOpts = {
      ...defaults,
      ...opts,
      audience: Array.isArray(opts?.audience)
        ? (opts.audience as [string, ...string[]])
        : opts?.audience,
    };
    const payload = jwt.verify(token, secret, normalizedOpts) as unknown as TPayload;
    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};