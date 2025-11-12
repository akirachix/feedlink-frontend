
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;

if (!baseUrl) {
  console.error('BASE_URL environment variable is not set!');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params; 
    const orderId = parseInt(resolvedParams.id, 10);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
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
    const { order_status } = body;

    if (!order_status || !['pending', 'picked'].includes(order_status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${baseUrl}/orders/${orderId}/`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_status: order_status
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
    console.error('Error updating order status from backend:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating order status' },
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
    const orderId = parseInt(resolvedParams.id, 10);
    
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'BASE_URL environment variable is not configured on the server.' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${baseUrl}/orders/${orderId}/` 
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
    console.error('Error fetching single order from backend:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching order' },
      { status: 500 }
    );
  }
}