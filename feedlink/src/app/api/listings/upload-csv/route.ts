const BASE_URL = process.env.BASE_URL

export async function POST(request: Request) {
  if (!BASE_URL) {
    return new Response('The system is not properly configured. Please try again.', { status: 500 });
  }

  try {
    const formData = await request.formData();

    const csvFile = formData.get('csv_file');
    if (!csvFile) {
      return new Response('Missing required file: csv_file', { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/listings/upload-csv/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText || 'Failed to upload CSV file.', { status: response.status || 500 });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: 'CSV uploaded successfully',
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = (error as Error).message || 'An error occurred while uploading the CSV file.';
    return new Response(message, { status: 500 });
  }
}