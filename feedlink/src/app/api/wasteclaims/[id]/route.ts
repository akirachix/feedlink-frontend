const baseUrl = process.env.BASE_URL;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wasteId = Number(id);

    if (!baseUrl)
      return new Response('BASE_URL environment variable is not configured.', { status: 500 });

    if (isNaN(wasteId))
      return new Response('Invalid waste claim ID', { status: 400 });

    const { claim_status } = await request.json();
    if (!['pending', 'collected'].includes(claim_status))
      return new Response('Invalid claim status', { status: 400 });

    const response = await fetch(`${baseUrl}/wasteclaims/${wasteId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim_status }),
    });

    const result = await response.json();
    if (!response.ok)
      return new Response(JSON.stringify(result), { status: response.status });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wasteId = Number(id);

    if (!baseUrl)
      return new Response('BASE_URL environment variable is not configured.', { status: 500 });

    const response = await fetch(`${baseUrl}/wasteclaims/${wasteId}/`);
    const result = await response.json();

    if (!response.ok)
      return new Response(JSON.stringify(result), { status: response.status });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}