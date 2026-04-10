import type { SessionResponseInterface } from "@/types/session.type";
import type { AuthSession } from "@/types/auth-session.type";
import API from "@/lib/api/axios-client";

export const sessionService = {

  getAllSessions : async() =>{
    const { data } = await API.get<SessionResponseInterface>(`/session/all`);
    return data;
  },

  async getUserSession(): Promise<AuthSession> {
    const { data } = await API.get<AuthSession>("/session");
    return data
  },

  async deleteSession(sessionId: number) {
    const { data } = await API.delete(`/session/${sessionId}`);
    return data;
  }
}