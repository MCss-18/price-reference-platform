export const USER_ROLES = {
  Admin:      14,
  Consultor:  15,
} as const;

export type RoleId = typeof USER_ROLES[keyof typeof USER_ROLES];