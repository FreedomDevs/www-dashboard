export interface Group {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  groups: Group[];
  permissions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UpdateUserPermissionsRequest {
  permissions: Record<string, string[]>;
}

export interface UpdateUserPermissionsResponse {
  groups: string[];
  permissions: Record<string, string[]>;
}
