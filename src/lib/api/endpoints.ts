export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/password',
  },

  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_DETECTIONS: '/dashboard/recent-detections',
    ACTIVE_PAUSES: '/dashboard/active-pauses',
    LICENSE_SUMMARY: '/dashboard/license-summary',
  },

  DEVICES: {
    LIST: '/devices',
    DETAIL: (id: string) => `/devices/${id}`,
    CREATE: '/devices',
    UPDATE: (id: string) => `/devices/${id}`,
    DELETE: (id: string) => `/devices/${id}`,
  },

  DETECTIONS: {
    LIST: '/detections',
    DETAIL: (id: string) => `/detections/${id}`,
    UPDATE_STATUS: (id: string) => `/detections/${id}/status`,
    STATS: '/detections/stats',
  },

  GROUPS: {
    LIST: '/groups',
    DETAIL: (id: string) => `/groups/${id}`,
    CREATE: '/groups',
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    DEVICES: (id: string) => `/groups/${id}/devices`,
    POLICIES: (id: string) => `/groups/${id}/policies`,
  },

  POLICIES: {
    LIST: '/policies',
    DETAIL: (id: string) => `/policies/${id}`,
    CREATE: '/policies',
    UPDATE: (id: string) => `/policies/${id}`,
    DELETE: (id: string) => `/policies/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/policies/${id}/toggle`,
  },

  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  PAUSES: {
    LIST: '/pauses',
    DETAIL: (id: string) => `/pauses/${id}`,
    CREATE: '/pauses',
    CANCEL: (id: string) => `/pauses/${id}/cancel`,
    HISTORY: '/pauses/history',
  },

  LICENSES: {
    LIST: '/licenses',
    DETAIL: (id: string) => `/licenses/${id}`,
    SYNC: (id: string) => `/licenses/${id}/sync`,
    SUMMARY: '/licenses/summary',
  },

  SCHOOLS: {
    LIST: '/schools',
    DETAIL: (id: string) => `/schools/${id}`,
  },

  NOTIFICATIONS: {
    SETTINGS: '/notifications/settings',
    UPDATE_SETTINGS: '/notifications/settings',
    TEST: '/notifications/test',
  },

  ACCOUNT: {
    PROFILE: '/account/profile',
    UPDATE_PROFILE: '/account/profile',
    CHANGE_PASSWORD: '/account/password',
  },

  MENU: {
    REGISTER: '/menu/register',
    UPDATE: '/menu/update',
    DELETE: '/menu/delete',
    ALL: '/menu/all',
    MY: '/menu/my',
    PERMISSION: '/menu/permission',
    PERMISSION_UPDATE: '/menu/permission/update',
  },
} as const;
