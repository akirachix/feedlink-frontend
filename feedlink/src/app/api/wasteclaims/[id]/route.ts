
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;

if (!baseUrl) {
  console.error('BASE_URL environment variable is not set in wasteclaims [id]/route.ts!');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const wasteId = parseInt(resolvedParams.id, 10);

    if (isNaN(wasteId)) {
      return NextResponse.json(
        { error: 'Invalid waste claim ID' },
        { status: 400 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'BASE_URL environment variable is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { claim_status } = body;

    if (!claim_status || !['pending', 'collected'].includes(claim_status)) {
      return NextResponse.json(
        { error: 'Invalid claim status' },
        { status: 400 }
      );
    }

  
    const response = await fetch(
      `${baseUrl}/wasteclaims/${wasteId}/`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim_status: claim_status
        })
      }
    );

    if (!response.ok) {
      console.error(`Backend API error on update: ${response.status} ${response.statusText}`);
      let errorDetails = 'Unknown error';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody || errorDetails;
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
      }
      console.error("Full backend error response body:", errorDetails);
      return NextResponse.json(
        { error: `Failed to update status: ${response.status} ${response.statusText}. Details: ${errorDetails}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error updating waste claim status from backend:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating waste claim status' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const wasteId = parseInt(resolvedParams.id, 10);

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'BASE_URL environment variable is not configured on the server.' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${baseUrl}/wasteclaims/${wasteId}/` 
    );

    if (!response.ok) {
      console.error(`Backend API error on fetch single: ${response.status} ${response.statusText}`);
      let errorDetails = 'Unknown error';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody || errorDetails;
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
      }
      return NextResponse.json(
        { error: `Backend API error: ${response.status} ${response.statusText}. Details: ${errorDetails}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error fetching single waste claim from backend:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching waste claim' },
      { status: 500 }
    );
  }
}