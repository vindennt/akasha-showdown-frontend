import { SessionData } from "@/lib/auth";

interface UserOut {
  session: SessionData;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface UserIn {
  email: string;
  password: string;
}

export async function signUp(userIn: UserIn): Promise<UserOut> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userIn),
    });

    if (!res.ok) {
      throw new Error("Failed to sign up");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}

export async function signIn(userIn: UserIn): Promise<UserOut> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userIn),
    });

    if (!res.ok) {
      throw new Error("Failed to sign in");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}
