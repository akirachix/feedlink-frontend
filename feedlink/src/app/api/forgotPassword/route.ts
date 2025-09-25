
const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return new Response("Invalid request. Please try again,", {
        status: 400,
      });
    }
    const response = await fetch(`${baseUrl}/forgotpassword/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "OTP generated",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}