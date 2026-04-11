import { Module, MODULE } from "@/constants/module-platform";
import { PERMISSION, Permission } from "@/constants/permissions";
import { USER_ROLES } from "@/constants/roles";


const PERMISSIONS_MATRIX: Record<number, Record<string, Permission[]>> = {
  [USER_ROLES.Admin]: {
    [MODULE.Products]: [PERMISSION.View],
    [MODULE.Users]: [PERMISSION.View],
  },
  [USER_ROLES.Consultor]: {
    [MODULE.Products]: [PERMISSION.View],
  }
};

// Funcion principal para verificar permisos
export function hasPermission(
  roleId: number | undefined,
  module: Module,
  permission: Permission
): boolean {
  if (!roleId) return false;
  
  const rolePermissions = PERMISSIONS_MATRIX[roleId];
  if (!rolePermissions) return false;
  
  const modulePermissions = rolePermissions[module];
  if (!modulePermissions) return false;
  
  return modulePermissions.includes(permission);
}

// Funciones auxiliares específicas
export function canView(roleId: number | undefined, module: Module): boolean {
  return hasPermission(roleId, module, PERMISSION.View);
}

// Verificar multiples permisos a la vez
export function hasAnyPermission(
  roleId: number | undefined,
  module: Module,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(roleId, module, permission));
}

// Obtener todos los permisos de un rol en un módulo
export function getModulePermissions(
  roleId: number | undefined,
  module: Module
): Permission[] {
  if (!roleId) return [];
  
  const rolePermissions = PERMISSIONS_MATRIX[roleId];
  if (!rolePermissions) return [];
  
  return rolePermissions[module] || [];
}