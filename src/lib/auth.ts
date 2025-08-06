import { SessionData, User } from "@/types/auth";

// Store session data in localStorage
export function setSession(session: SessionData): void {
  localStorage.setItem("session", JSON.stringify(session));
}

// Retrieve session data from localStorage
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

// Retrieve user information from session
export function getUser(): User | null {
  const session = getSession();

  if (session && session.user) {
    const user: User = {
      id: session.user.id,
      email: session.user.email,
    };
    return user;
  }

  return null;
}

// Retrieve access token from session
export function getAccessToken(): string | null {
  return getSession()?.access_token ?? null;
}
