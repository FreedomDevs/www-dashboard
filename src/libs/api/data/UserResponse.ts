export interface User {
  id: string;
  name: string;
  groups: string[];
  permissions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
}
