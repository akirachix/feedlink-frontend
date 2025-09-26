const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, password, role, till_number, address } = body;
    if (!first_name || !last_name || !email || !password || !role || !till_number || !address) {
      return new Response(
        "Missing required values: first_name, last_name, email, password, role, till_number, address", 
        { status: 400 }
      );
    }
    const response = await fetch(`${baseUrl}/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password, role, till_number, address}),
    });
  
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "User sign up successfully",
    });
  } catch (error) {
    return new Response("Failed to sign up: " + (error as Error).message, {
      status: 500,
    });
  }
}





