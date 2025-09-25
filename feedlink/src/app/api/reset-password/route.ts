export async function POST(request: Request) {
  const baseUrl = process.env.BASE_URL;
  try {
    const { email, password, confirmPassword } = await request.json();
    if (!email || !password || !confirmPassword) {
      return new Response("Invalid request. Email, password and confirmPassword are required.", {
        status: 400,
      });
    }
    const response = await fetch(`${baseUrl}/reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirm_password: confirmPassword }), 
    });
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.ok ? 201 : response.status,
      statusText: response.ok
        ? "Password reset successful"
        : "Failed to reset password",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}











