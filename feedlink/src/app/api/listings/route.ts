const baseUrl = process.env.BASE_URL; 

export async function GET() {
  if (!baseUrl) {
    return new Response("BASE_URL environment variable is not set", { status: 500 });
  }

  try {
    const response = await fetch(`${baseUrl}/listings/`); 
    if (!response.ok) {
      return new Response("Failed to fetch listings", { status: response.status });
    } 
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
export async function POST(request: Request) {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return new Response("BASE_URL environment variable is not set", { status: 500 });
  }

  try {
    const formData = await request.formData();

    const alwaysRequired = [
      "product_type",
      "quantity",
      "upload_method",
      "pickup_window_duration",
      "unit",
      "producer",
    ];

    for (const field of alwaysRequired) {
      const value = formData.get(field);
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return new Response(`Missing required field: ${field}`, { status: 400 });
      }
    }

    const imageFile = formData.get("image");
    const imageUrl = formData.get("image_url");

    if (
      (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) &&
      (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === ''))
    ) {
      return new Response("Either 'image' (file upload) or 'image_url' must be provided", { status: 400 });
    }

    
    const response = await fetch(`${baseUrl}/listings/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Failed to create listing: ${errorText}`, { status: response.status });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "Listing created successfully",
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating listing:", error);
    return new Response((error as Error).message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}