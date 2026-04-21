// ============================================
// Common Types
// ============================================

export type Status = 'active' | 'inactive';
export type PauseStatus = 'normal' | 'paused';
export type DetectionType = '선정성' | '도박';
export type DetectionStatus = 'confirmed' | 'dismissed' | 'reviewing';
export type PauseState = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type PauseType = '전체' | '선정성' | '도박';
export type UserRole = 'admin' | 'staff' | 'teacher';
export type OSType = 'Android' | 'iOS' | 'Windows' | 'ChromeBook' | 'WhaleBook';
export type NotiType = 'basic' | 'popup' | 'strong';

// ============================================
// Entity Types
// ============================================

export interface School {
  schoolId: string;
  name: string;
  type: string;
  status: Status;
  address: string;
}

export interface Group {
  groupId: string;
  name: string;
  deviceCount: number;
  policyCount: number;
  pauseStatus: PauseStatus;
  status: Status;
  updatedAt: string;
  schoolId: string;
}

export interface Device {
  deviceId: string;
  name: string;
  identifier: string;
  groupId: string;
  groupName: string;
  status: 'online' | 'offline';
  policyStatus: 'applied' | 'pending';
  lastContact: string;
  model: string;
  os: string;
}

export interface Policy {
  policyId: string;
  name: string;
  desc: string;
  type: DetectionType;
  detectionItems?: string[];
  grade?: string;
  detectedUrls?: string[];
  exceptions: string[];
  active: boolean;
  appliedCount: number;
  updatedAt: string;
}

export interface Detection {
  detId: string;
  detectedAt: string;
  type: DetectionType;
  groupName: string;
  groupId: string;
  deviceName: string;
  deviceId: string;
  policy: string;
  status: DetectionStatus;
  thumb: number;
  content: string[];
}

export interface User {
  userId: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  contact: string;
  status: Status;
  lastLogin: string;
  assignments: { groupId: string }[];
}

export interface Pause {
  pauseId: string;
  groupId: string;
  pauseType: PauseType;
  requester: string;
  requesterRole: UserRole;
  startAt: string;
  endAt: string;
  status: PauseState;
  reason: string;
  cancelReason: string | null;
}

export interface License {
  os: OSType;
  detectionType: string;
  devices: number;
  usedDevices: number;
  validFrom: string;
  validTo: string;
  status: Status;
  serialKey: string;
  school: string;
  type: string;
  supportContact: string;
  supportTel: string;
  manager: string;
  lastSync: string;
}

export interface Service {
  serviceId: string;
  name: string;
  packageName: string;
}

export interface Stats {
  totalGroups: number;
  totalDevices: number;
  onlineDevices: number;
  totalPolicies: number;
  activePauses: number;
  todayDetections: number;
  weeklyDetections: number;
  confirmedDetections: number;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  emailAddress: string;
  smsEnabled: boolean;
  smsNumber: string;
  detectionAlert: boolean;
  dailyReport: boolean;
  weeklyReport: boolean;
  pauseAlert: boolean;
  alertThreshold: number;
  notiType: NotiType;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardStats extends Stats {
  licensesTotal: number;
  licensesUsed: number;
}

// ============================================
// API Request Types
// ============================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateDeviceRequest {
  name: string;
  identifier: string;
  groupId: string;
}

export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {
  id: string;
}

export interface CreateGroupRequest {
  name: string;
  schoolId: string;
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
  id: string;
}

export interface CreatePolicyRequest {
  name: string;
  desc: string;
  type: DetectionType;
  detectionItems?: string[];
  grade?: string;
  exceptions: string[];
}

export interface UpdatePolicyRequest extends Partial<CreatePolicyRequest> {
  id: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: UserRole;
  contact: string;
  assignments: { groupId: string }[];
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  id: string;
  status?: Status;
}

export interface CreatePauseRequest {
  groupId: string;
  pauseType: PauseType;
  startAt: string;
  endAt: string;
  reason: string;
}

export interface CancelPauseRequest {
  id: string;
  reason: string;
}

// ============================================
// Filter Types
// ============================================

export interface DeviceFilters {
  search?: string;
  groupId?: string;
  status?: 'online' | 'offline';
}

export interface DetectionFilters {
  type?: DetectionType;
  search?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export interface GroupFilters {
  search?: string;
  schoolType?: string;
  status?: Status;
}

export interface PolicyFilters {
  type?: DetectionType;
  search?: string;
  active?: boolean;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: Status;
}

export interface PauseFilters {
  status?: PauseState;
}

export interface PauseHistoryFilters {
  search?: string;
  schoolType?: string;
  status?: PauseState;
}

export interface LicenseFilters {
  os?: OSType;
  search?: string;
}

// Account API Types
export * from './account';

// License API Types
export * from './license';

// Detection API Types
export * from './detection';

// Menu API Types
export * from './menu';
