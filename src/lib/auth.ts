export interface SessionData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
  };
}

// All in on manager for session data
// TODO: Handle session storage more securely

export function getSession(): SessionData | null {
  const sessionRaw = localStorage.getItem("session");
  if (!sessionRaw) {
    return null;
  }

  try {
    return JSON.parse(sessionRaw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(session: SessionData): void {
  localStorage.setItem("session", JSON.stringify(session));
}

export function getAccessToken(): string | null {
  return getSession()?.access_token ?? null;
}
