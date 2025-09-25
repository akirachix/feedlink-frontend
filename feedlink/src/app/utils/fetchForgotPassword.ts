const baseUrl = "/api/forgotPassword/";
export async function forgotPasswordApi(email: string) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server");
  }
  if (!response.ok) {
    throw new Error(data.detail || "Failed to send OTP");
  }
  return data;
}

