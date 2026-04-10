import { useMemo } from 'react';
import useAuth from './use-auth';
import {
  canView,
  getModulePermissions,
} from '@/lib/permissions';
import { Module } from '@/constants/module-platform';

export function usePermissions(module: Module) {
  const { data } = useAuth();
  const roleId = data?.user?.rolId;

  const permissions = useMemo(() => {
    return {
      canView: canView(roleId, module),
      all: getModulePermissions(roleId, module),
      roleId,
    };
  }, [roleId, module]);

  return permissions;
}