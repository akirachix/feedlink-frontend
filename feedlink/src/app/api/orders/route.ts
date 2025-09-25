const baseUrl = process.env.API_BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${baseUrl}/api/orders/`);
    const orders = await res.json(); 
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}