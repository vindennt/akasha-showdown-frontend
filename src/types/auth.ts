export interface SessionData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
  };
  expires_at: number;
}

export interface SessionOut {
  session: SessionData;
  message?: string;
}

export interface UserIn {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}
