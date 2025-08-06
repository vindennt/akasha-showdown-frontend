import { getSession, setSession } from "@//lib/auth";
import { SessionData } from "@/types/auth";
import { config } from "@/config";

// Middleware to handle authentication headers and access token refreshes
// Wrapss fetch requests that needs authentication
// Takes a fetch request input and optional init object
// Returns the fetch response with the Authorization header set
export async function authMiddleware(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  let session = getSession();

  if (!session) {
    throw new Error("No session found");
  }

  // Check if the session is expired or about to expire
  const timeNow = Math.floor(Date.now() / 1000);
  const timeBuffer = 30;
  if (session.expires_at <= timeNow + timeBuffer) {
    session = await refreshAccessToken(session.refresh_token);
  }

  const accessToken = session.access_token;

  const headers = {
    ...init.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  return fetch(input, { ...init, headers });
}

// Refreshes the access token using the refresh token
// Returns the refreshed session data
export async function refreshAccessToken(
  refreshToken: string
): Promise<SessionData> {
  try {
    const url = `${config.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.SUPABASE_KEY,
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
