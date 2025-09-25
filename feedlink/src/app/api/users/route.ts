const baseUrl = process.env.BASE_URL;

export async function GET(request: Request) {
  if (!baseUrl) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return new Response(`Backend error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const data = await response.json();
    const producers = data.filter((user: { role: string }) => user.role === "producer");

    return new Response(JSON.stringify(producers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Fetch failed: ${(error as Error).message}`, { status: 500 });
  }
}