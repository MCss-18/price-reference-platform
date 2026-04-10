export const PERMISSION= {
  View: "view",
} as const;

export type Permission = typeof PERMISSION[keyof typeof PERMISSION];