import { authMiddleware } from "@/api/middleware/authMiddleware";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ItemIn {
  title: string;
  description: string;
}

export async function createItem(itemIn: ItemIn): Promise<Response> {
  const url = `${API_BASE_URL}/item/create-item`;

  try {
    const res = await authMiddleware(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
