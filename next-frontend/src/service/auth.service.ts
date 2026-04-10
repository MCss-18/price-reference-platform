import API from '@/lib/api/axios-client';
import { AUTH_ENDPOINTS } from '@/lib/api/endpoints';
import { Auth } from '@/types/auth.type';

export const authService = {

  login : async (data: Auth) => await API.post(AUTH_ENDPOINTS.LOGIN, data),

  logout : async () => await API.post(AUTH_ENDPOINTS.LOGOUT)

}