export type AuthResponse = {
  token: string;
  refreshToken: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  username: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  displayName: string;
  username: string;
  email: string;
  password: string;
};
