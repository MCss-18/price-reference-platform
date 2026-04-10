export interface Session {
  sessionId: number;
  userId: number;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface SessionResponseInterface {
  message: string;
  sessions: Session[];
};