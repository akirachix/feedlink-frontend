const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response('Missing required fields: email, password',{status: 400, statusText: 'Bad Request',});
    }

    const response = await fetch(`${baseUrl}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      statusText: response.statusText,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      (error as Error).message,
      {
        status: 500,
        statusText: 'Internal Server Error',
      }
    );
  }
}