const baseUrl = process.env.BASE_URL;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!baseUrl)
      return new Response('BASE_URL environment variable is not configured.', { status: 500 });

    if (isNaN(orderId))
      return new Response('Invalid order ID', { status: 400 });

    const { order_status } = await request.json();
    if (!['pending', 'picked'].includes(order_status))
      return new Response('Invalid order status', { status: 400 });

    const response = await fetch(`${baseUrl}/orders/${orderId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status }),
    });

    const result = await response.json();
    if (!response.ok)
      return new Response(JSON.stringify(result), { status: response.status });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!baseUrl)
      return new Response('BASE_URL environment variable is not configured.', { status: 500 });

    const response = await fetch(`${baseUrl}/orders/${orderId}/`);
    const result = await response.json();

    if (!response.ok)
      return new Response(JSON.stringify(result), { status: response.status });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
    return new Response('Internal server error', { status: 500 });
  }
}