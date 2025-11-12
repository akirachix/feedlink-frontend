const baseUrl = "/api/orders/";

export async function fetchOrders() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error("Something went wrong: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to fetch orders: " + (error as Error).message);
  }
}

export async function updateOrderStatus(orderId: number, newStatus: "pending" | "picked") {
  try {
    const response = await fetch(`${baseUrl}${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_status: newStatus
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to update status: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update order status: " + (error as Error).message);
  }
}