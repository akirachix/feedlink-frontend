const baseUrl = "/api/wasteclaims/";

export async function fetchWasteclaims() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error("Something went wrong" + response.statusText);
    }
    const result = await response.json();

    return result;
  } catch (error) {
    throw new Error("Failed to fetch waste claims:" + (error as Error).message);
  }
}

export async function updateWasteClaimStatus(wasteId: number, newStatus: "pending" | "collected") {
  try {
    const response = await fetch(`${baseUrl}${wasteId}`, { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claim_status: newStatus
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to update status: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to update waste claim status: " + (error as Error).message);
  }
}