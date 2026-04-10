export const USER_ROLES = {
  Admin:      1,
  Ingeniero:  2,
} as const;

export type RoleId = typeof USER_ROLES[keyof typeof USER_ROLES];