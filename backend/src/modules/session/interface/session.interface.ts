export interface Session  {
  sessionId: number;
  userId: number;
  userAgent?: string;
  token?: string;
  expiredAt?: string;
  createdAt?: string;
}