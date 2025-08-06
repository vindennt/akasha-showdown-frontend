const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ItemIn {
  title: string;
  description: string;
}

export async function createItem(itemIn: ItemIn): Promise<Response> {
  // TODO: do away with local session

  const localSession = localStorage.getItem("session");
  if (!localSession) {
    throw new Error("No session found.");
  }
  // TODO: handle session more securely
  const access_token = JSON.parse(localSession).access_token;

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
