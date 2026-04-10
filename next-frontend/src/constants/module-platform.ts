export const MODULE = {
  Products: "productos",
  Services: "servicios",
  Budget: "presupuesto",
  Users: "usuarios",
} as const;

export type Module = typeof MODULE[keyof typeof MODULE];

const BASE = "/panel";

export const ROUTES = {
  Products: `${BASE}/${MODULE.Products}`,
  Services: `${BASE}/${MODULE.Services}`,
  Budget: `${BASE}/${MODULE.Budget}`,
  Users: `${BASE}/${MODULE.Users}`
} as const;