import { getSession, SessionData, setSession } from "@//lib/auth";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function authMiddleware(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  let session = getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const timeNow = Math.floor(Date.now() / 1000);
  if (session.expires_at <= timeNow + 30) {
    session = await refreshAccessToken(session.refresh_token);
  }

  const accessToken = session.access_token;

  const headers = {
    ...init.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  return fetch(input, { ...init, headers });
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<SessionData> {
  try {
    const url = `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await res.json();

    const timeNow = Math.floor(Date.now() / 1000);

    const refreshedSession: SessionData = {
      ...data,
      user: data.user,
      expires_at: timeNow + data.expires_in,
    };

    setSession(refreshedSession);

    return refreshedSession;
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}
