import type { Session } from "@/types/session.type";
import type { AuthSession } from "@/types/auth-session.type";
import API from "@/lib/api/axios-client";
import { SESSION_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/core/api-response";

export const sessionService = {

  getAllSessions : async() =>{
    const { data } = await API.get<ApiResponse<Session>>(SESSION_ENDPOINTS.ALL);
    return data;
  },

  async getUserSession(): Promise<AuthSession> {
    const { data } = await API.get<AuthSession>(SESSION_ENDPOINTS.ALL_BY_USER);
    return data
  },

  async deleteSession(id: number) {
    const { data } = await API.delete(SESSION_ENDPOINTS.DELETE(id));
    return data;
  }
}