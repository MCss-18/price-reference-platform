import { User } from "./user.type";

export interface AuthSession {
  user: User;
  session: {
    sessionId: number;
    expiresAt: string;
  };
}