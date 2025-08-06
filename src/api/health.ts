const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function pingHealth(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/health/ping`);

    if (!res.ok) {
      throw new Error("Failed to ping health");
    }

    return res.text();
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}
