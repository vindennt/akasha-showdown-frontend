import { config } from "@/config";

// Interface for the health check response
export async function pingHealth(): Promise<string> {
  const url = `${config.API_BASE_URL}/health/ping`;

  try {
    const res = await fetch(url, {
      headers: { "ngrok-skip-browser-warning": "any-value" },
    });

    if (!res.ok) {
      throw new Error("Failed to ping health");
    }

    return res.text();
  } catch (error) {
    throw new Error(`Error: ${(error as Error).message}`);
  }
}
