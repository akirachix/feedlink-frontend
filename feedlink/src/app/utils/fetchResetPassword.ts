const baseUrl = "/api/reset-password";
export async function resetPasswordApi(password: string, confirmPassword: string) {
  const email = localStorage.getItem("forgotEmail"); 
  if (!email) {
    throw new Error("No email found. Please restart the reset process.");
  }
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON");
  }
  if (!res.ok) {
    throw new Error(data.detail || "Failed to reset password");
  }
  return data;
}