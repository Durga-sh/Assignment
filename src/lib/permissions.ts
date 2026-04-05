import type { Role } from '../types/finance'

export type Permission =
  | 'view:overview'
  | 'view:transactions'
  | 'view:insights'
  | 'export:data'
  | 'create:transaction'
  | 'edit:transaction'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: [
    'view:overview',
    'view:transactions',
    'view:insights',
    'export:data',
  ],
  admin: [
    'view:overview',
    'view:transactions',
    'view:insights',
    'export:data',
    'create:transaction',
    'edit:transaction',
  ],
}

export function can(role: Role, action: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(action)
}


export type RoleMeta = {
  role: Role
  label: string
  description: string
  permissions: string[]
  color: string
  badgeBg: string
  badgeText: string
  avatarBg: string
}

export const ROLE_META: Record<Role, RoleMeta> = {
  viewer: {
    role: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to all financial data and reports.',
    permissions: ['Browse transactions', 'View insights & charts', 'Export reports'],
    color: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-100 dark:bg-sky-950',
    badgeText: 'text-sky-700 dark:text-sky-300',
    avatarBg: 'bg-linear-to-br from-sky-400 to-cyan-500',
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'Full control — manage, add, and edit all transactions.',
    permissions: ['All Viewer access', 'Add income & expenses', 'Edit existing transactions'],
    color: 'text-violet-600 dark:text-violet-400',
    badgeBg: 'bg-violet-100 dark:bg-violet-950',
    badgeText: 'text-violet-700 dark:text-violet-400',
    avatarBg: 'bg-linear-to-br from-violet-500 to-purple-600',
  },
}
