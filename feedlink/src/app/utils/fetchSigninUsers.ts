const baseUrl = "/api/login";

export async function fetchSignin(email: string, password: string,) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to login: " + (error as Error).message);
  }
}