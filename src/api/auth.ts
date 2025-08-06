import { UserIn, SessionOut } from "@/types/auth";
import { config } from "@/config";

// POST method that handles authentication requests
// Returns a SessionOut object containing session data
async function postAuth(endpoint: string, userIn: UserIn): Promise<SessionOut> {
  const url = `${config.API_BASE_URL}/auth/${endpoint}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userIn),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    const data = await res.json();

    const timeNow = Math.floor(Date.now() / 1000);

    return {
      session: {
        ...data.session,
        expires_at: timeNow + data.session.expires_in,
      },
    };
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}

export async function signIn(userIn: UserIn): Promise<SessionOut> {
  return postAuth("signin", userIn);
}

export async function signUp(userIn: UserIn): Promise<SessionOut> {
  return postAuth("signup", userIn);
}
