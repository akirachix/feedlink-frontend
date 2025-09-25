const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${baseUrl}/wasteclaims/`);
    const wasteClaims = await res.json();
    return new Response(JSON.stringify(wasteClaims), { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}