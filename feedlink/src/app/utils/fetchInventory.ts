
export async function fetchListings() {
  try {
    const response = await fetch('/api/listings/');
    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to fetch listings: ' + (err as Error).message);
  }
}