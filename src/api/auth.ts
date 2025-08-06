import { SessionData } from "@/lib/auth";
import { config } from "@/config";

interface UserOut {
  session: SessionData;
  message?: string;
}

interface UserIn {
  email: string;
  password: string;
}

async function postAuth(endpoint: string, userIn: UserIn): Promise<UserOut> {
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

export async function signIn(userIn: UserIn): Promise<UserOut> {
  return postAuth("signin", userIn);
}

export async function signUp(userIn: UserIn): Promise<UserOut> {
  return postAuth("signup", userIn);
}
