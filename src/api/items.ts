import { ItemIn } from "@/types/item";
import { authMiddleware } from "@/api/middleware/authMiddleware";
import { config } from "@/config";

// POST method that creates a new item tied to the authenticated user
// Returns a Response object
export async function createItem(itemIn: ItemIn): Promise<Response> {
  const url = `${config.API_BASE_URL}/item/create-item`;

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
