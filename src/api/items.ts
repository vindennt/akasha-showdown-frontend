import { getAccessToken } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ItemIn {
  title: string;
  description: string;
}

export async function createItem(itemIn: ItemIn): Promise<Response> {
  // TODO: do away with local session

  const access_token = getAccessToken();

  if (!access_token) {
    throw new Error("No session found.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/item/create-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(itemIn),
    });

    if (!res.ok) {
      throw new Error("Failed to create item");
    }

    return res;
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}
