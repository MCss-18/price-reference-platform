// ============================================
// SESSION_ENDPOINTS
// ============================================
export const SESSION_ENDPOINTS = {
  ALL: '/session/all',
  ALL_BY_USER: '/session/',
  DELETE: (id: number) => `/session/${id}`,
} as const;

// ============================================
// AUTH_ENDPOINTS
// ============================================
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
} as const;

// ============================================
// USERS_ENDPOINTS
// ============================================
export const USERS_ENDPOINTS = {
  BASE: '/users',
} as const;

// ============================================
// PRODUCT_ENDPOINTS
// ============================================
export const PRODUCT_ENDPOINTS = {
  PAGINATED: (page: number, limit: number, search: string="") => `/products/?page=${page}&limit=${limit ?? 10}&search=${search}`,
} as const;

// ============================================
// PURCHASES_ENDPOINTS
// ============================================
export const PURCHASES_ENDPOINTS = {
  PRICES_BY_PRODUCT: (productCode: string, startDate: string, endDate: string) => `/purchases/${productCode}?startDate=${startDate}&endDate=${endDate}`,
} as const;
