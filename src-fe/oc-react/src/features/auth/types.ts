export type AuthResponse = {
  token: string;
  refreshToken: string;
  email: string;
  displayName: string;
  roles: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  displayName: string;
  email: string;
  password: string;
};

